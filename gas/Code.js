/**
 * yoonLab 작품 전시관 — 전시 페이지에서 추가한 작품을 이 구글 시트에 한 줄씩 쌓는 스크립트.
 *
 *  - '추가한 작품' 탭: 페이지에서 추가한 작품이 한 줄씩 쌓입니다. 줄을 지우면 책이 빠지고, 글자를 고치면 책이 바뀝니다.
 *  - '설정' 탭: B1 칸에 적힌 글자가 추가할 때 쓰는 비밀번호입니다. 비어 있으면 아무도 추가할 수 없습니다.
 */
var LIST = '추가한 작품';
var SETUP = '설정';
var HEAD = ['추가한 때', '제목', '한 줄 설명', '주소', '칸', '사진'];
var DEFAULT_SHELF = '웹앱';
var MAX_ROWS = 300;
var MAX_FAILS = 8;          // 비밀번호를 이만큼 틀리면
var LOCK_SECONDS = 600;     // 이 시간(초) 동안 추가를 막는다
var LIST_CACHE_SECONDS = 20;

/** 필요한 탭이 없으면 만든다. */
function tabs_() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var list = book.getSheetByName(LIST);
  if (!list) {
    var first = book.getSheets()[0];
    list = first.getLastRow() === 0 ? first.setName(LIST) : book.insertSheet(LIST);
    list.setColumnWidth(1, 150); list.setColumnWidth(2, 220); list.setColumnWidth(3, 360);
    list.setColumnWidth(4, 320); list.setColumnWidth(5, 120); list.setColumnWidth(6, 200);
  }
  head_(list);
  var setup = book.getSheetByName(SETUP);
  if (!setup) {
    setup = book.insertSheet(SETUP);
    setup.getRange('A1').setValue('비밀번호').setFontWeight('bold');
    setup.getRange('B1').setBackground('#FFF2CC');
    setup.getRange('A3').setValue('노란 칸(B1)에 비밀번호를 적으세요. 전시 페이지에서 작품을 추가할 때 이 비밀번호를 물어봅니다.');
    setup.getRange('A4').setValue('비밀번호를 바꾸려면 노란 칸의 글자를 고치면 됩니다. 칸을 비우면 아무도 추가할 수 없습니다.');
    setup.setColumnWidth(1, 110); setup.setColumnWidth(2, 220);
  }
  return { list: list, setup: setup };
}

/** 첫 줄에 머리글이 없으면(탭을 통째로 비웠거나 첫 줄을 지웠으면) 다시 만든다. */
function head_(list) {
  var has = false;
  if (list.getLastRow() > 0) {
    var first = list.getRange(1, 1, 1, HEAD.length).getDisplayValues()[0];
    has = String(first[1]).trim() === HEAD[1] && String(first[3]).trim() === HEAD[3];
    if (!has) list.insertRowBefore(1);
  }
  if (!has) {
    list.getRange(1, 1, 1, HEAD.length).setValues([HEAD]).setFontWeight('bold');
    list.setFrozenRows(1);
  }
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function goodUrl_(text) {
  // http(s)://주소이름[:포트][/나머지] — 주소이름에는 빈칸, 괄호, 따옴표, @ 등이 들어갈 수 없다
  return /^https?:\/\/[^\s\/?#\[\]@"'<>\\:]+(:\d{1,5})?([\/?#][^\s"'<>\\]*)?$/i.test(text);
}

/** 시트가 글자를 계산식으로 바꾸지 않게 한다. */
function plain_(text) {
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

/** 전시 페이지가 추가된 작품 목록을 읽어 간다. */
function doGet() {
  var cache = CacheService.getScriptCache();
  var kept = cache.get('works');
  if (kept) return ContentService.createTextOutput(kept).setMimeType(ContentService.MimeType.JSON);
  var rev = cache.get('rev');
  var t = tabs_();
  var last = t.list.getLastRow();
  var rows = last > 1 ? t.list.getRange(2, 1, last - 1, HEAD.length).getValues() : [];
  var works = [];
  rows.forEach(function (r) {
    var w = {
      title: String(r[1]).trim(), description: String(r[2]).trim(), url: String(r[3]).trim(),
      shelf: String(r[4]).trim(), image: String(r[5]).trim(),
    };
    if (w.title && goodUrl_(w.url)) works.push(w);
  });
  var out = JSON.stringify({ ok: true, works: works });
  // 읽는 사이에 누가 책을 꽂았으면(rev 가 바뀌었으면) 이 목록은 이미 옛것이라 기억하지 않는다
  try { if (cache.get('rev') === rev) cache.put('works', out, LIST_CACHE_SECONDS); } catch (err) { /* 너무 크면 기억하지 않는다 */ }
  return ContentService.createTextOutput(out).setMimeType(ContentService.MimeType.JSON);
}

/** 전시 페이지에서 '책 꽂기'를 누르면 여기로 온다. */
function doPost(e) {
  var body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, reason: 'broken' }); }
  if (!body || typeof body !== 'object') return json_({ ok: false, reason: 'broken' });

  var title = String(body.title == null ? '' : body.title).trim();
  var description = String(body.description == null ? '' : body.description).trim();
  var url = String(body.url == null ? '' : body.url).trim();
  var shelf = String(body.shelf == null ? '' : body.shelf).trim() || DEFAULT_SHELF;
  if (!title || title.length > 80) return json_({ ok: false, reason: 'title' });
  if (description.length > 200) return json_({ ok: false, reason: 'description' });
  if (!goodUrl_(url) || url.length > 500) return json_({ ok: false, reason: 'url' });
  if (shelf.length > 40) return json_({ ok: false, reason: 'shelf' });

  // 한 번에 한 요청씩만 처리한다(비밀번호를 한꺼번에 여러 개 넣어 보는 것도 막는다)
  var lock = LockService.getScriptLock();
  try { lock.waitLock(20000); } catch (err) { return json_({ ok: false, reason: 'busy' }); }
  try {
    var cache = CacheService.getScriptCache();
    var notes = PropertiesService.getScriptProperties();
    var now = Date.now();
    var fails = 0, failedAt = 0;
    try { var kept = JSON.parse(notes.getProperty('fails') || '{}'); fails = Number(kept.n) || 0; failedAt = Number(kept.at) || 0; } catch (err) { fails = 0; }
    if (now - failedAt > LOCK_SECONDS * 1000) fails = 0;   // 마지막으로 틀린 지 10분이 지나면 다시 0부터
    if (fails >= MAX_FAILS) return json_({ ok: false, reason: 'locked' });

    var t = tabs_();
    var secret = String(t.setup.getRange('B1').getDisplayValue()).trim();
    if (!secret) return json_({ ok: false, reason: 'nopassword' });
    if (String(body.password == null ? '' : body.password).trim() !== secret) {
      notes.setProperty('fails', JSON.stringify({ n: fails + 1, at: now }));
      Utilities.sleep(1000);   // 비밀번호를 마구 넣어 보는 것을 느리게 한다
      return json_({ ok: false, reason: 'password' });
    }

    var last = t.list.getLastRow();
    if (last > 1) {
      var urls = t.list.getRange(2, 4, last - 1, 1).getValues();
      for (var i = 0; i < urls.length; i++) {
        if (String(urls[i][0]).trim() === url) return json_({ ok: false, reason: 'duplicate' });
      }
    }
    if (last - 1 >= MAX_ROWS) return json_({ ok: false, reason: 'full' });
    t.list.appendRow([new Date(), plain_(title), plain_(description), plain_(url), plain_(shelf), '']);
    cache.put('rev', String(now), 21600);
    cache.remove('works');
  } finally {
    lock.releaseLock();
  }
  return json_({ ok: true, work: { title: title, description: description, url: url, shelf: shelf, image: '' } });
}

/** 처음 한 번, 스크립트 편집기에서 이 함수를 실행하면 권한 허용 창이 뜨고 탭이 만들어진다. */
function setup() {
  tabs_();
}
