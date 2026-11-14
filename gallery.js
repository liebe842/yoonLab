// yoonLab 작품 전시관 — 책장을 그리고, 책을 누르면 표지를 보여 주는 부분.
// 작품을 추가하거나 고칠 때는 이 파일이 아니라 works.js 만 고치면 됩니다.
(function () {
  "use strict";

  // 책 천 색과 박(글씨) 색
  var CLOTH = [["#263C63", "#E9CB78"], ["#7F2A45", "#F2DCAE"], ["#D6A021", "#2B2110"], ["#2E6249", "#EDDCA9"], ["#B4472D", "#F9E8C8"], ["#2D2C33", "#DCC68F"], ["#8FB6C9", "#1D2B34"]];
  var TALL = [238, 216, 248, 224, 242, 210, 232];
  var DEFAULT_SHELF = "웹앱";

  function el(tag, props) {
    var n = document.createElement(tag);
    for (var k in props || {}) {
      if (k === "class") n.className = props[k];
      else if (k === "text") n.textContent = props[k];
      else n.setAttribute(k, props[k]);
    }
    for (var i = 2; i < arguments.length; i++) if (arguments[i] != null) n.append(arguments[i]);
    return n;
  }
  function svg(cls, box, inner) {
    var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("class", "prop " + cls); s.setAttribute("viewBox", box); s.setAttribute("aria-hidden", "true");
    s.innerHTML = inner;
    return s;
  }

  var shelves = document.getElementById("shelves");
  var bookcase = document.getElementById("case");
  var stage = document.getElementById("stage");
  var bk = document.getElementById("bk");
  var viewer = document.getElementById("viewer");
  var hold = document.getElementById("hold");
  var bk2 = document.getElementById("bk2");
  var guide = document.getElementById("guide");
  var count = document.getElementById("count");
  var still = window.matchMedia("(prefers-reduced-motion: reduce)");

  // 책장 대신 안내 문구만 보여 준다
  function say(message) {
    stage.remove(); guide.remove(); count.remove();
    bookcase.replaceWith(el("p", { class: "empty", text: message }));
  }

  // 목록 파일(works.js)에 오타가 있으면 WORKS 가 만들어지지 않거나, 읽으려는 순간 오류가 난다
  var source;
  try { source = WORKS; } catch (e) { source = undefined; }
  if (!Array.isArray(source)) {
    say("작품 목록 파일(works.js)을 읽지 못했어요. 마지막으로 고친 묶음에서 쉼표(,)나 따옴표(\")가 빠지지 않았는지 확인해 주세요.");
    return;
  }

  function goodUrl(text) {
    if (typeof text !== "string" || /\s/.test(text.trim())) return false;
    try {
      var u = new URL(text.trim());
      return (u.protocol === "http:" || u.protocol === "https:") && u.hostname.length > 0;
    } catch (e) { return false; }
  }
  function usable(w) {
    return w && typeof w === "object" && typeof w.title === "string" && w.title.trim() && goodUrl(w.url);
  }
  var list = source.filter(usable).map(function (w) {
    return {
      title: w.title.trim(),
      description: typeof w.description === "string" ? w.description.trim() : "",
      url: w.url.trim(),
      image: typeof w.image === "string" && w.image.trim() ? w.image.trim() : "",
      shelf: typeof w.shelf === "string" && w.shelf.trim() ? w.shelf.trim() : DEFAULT_SHELF,
    };
  });
  if (source.length !== list.length && window.console) console.warn("제목이나 주소가 빠졌거나 잘못된 작품 " + (source.length - list.length) + "개는 건너뛰었습니다.");
  if (!list.length) {
    say("아직 꽂힌 책이 없어요. 작품 목록 파일(works.js)에 첫 작품을 적어 주세요.");
    return;
  }

  var books = [];
  var broken = {};          // 사진을 불러오지 못한 작품
  var current = -1;
  function paint(i) { return "--c: " + CLOTH[i % CLOTH.length][0] + "; --f: " + CLOTH[i % CLOTH.length][1]; }

  // 칸(선반 이름)별로 묶기. 목록에 처음 나온 순서대로 위에서부터 놓인다.
  var groups = [], byName = Object.create(null);
  list.forEach(function (w, i) {
    if (!byName[w.shelf]) { byName[w.shelf] = { name: w.shelf, items: [] }; groups.push(byName[w.shelf]); }
    byName[w.shelf].items.push(i);
  });

  var decor = null, lastSlot = null;
  groups.forEach(function (g, gi) {
    if (gi) shelves.append(el("div", { class: "board", "aria-hidden": "true" }));
    var ul = el("ul", { class: "shelf", "aria-label": g.name + " 칸" });
    ul.append(el("li", { class: "slot", "aria-hidden": "true" }, el("span", { class: "tag", text: g.name })));
    g.items.forEach(function (i, n) {
      var w = list[i];
      var len = Array.from(w.title).length;
      var tall = TALL[i % TALL.length] + (len > 8 ? 14 : 0);
      var b = el("button", {
        class: "book", type: "button", "aria-pressed": "false", "aria-label": w.title + " 책 뽑아 보기",
        style: paint(i) + "; --h: " + tall + "px; --w: " + (len <= 6 ? 48 : 56) + "px",
      }, el("span", { class: "spine cloth" }, el("i")), el("span", { class: "t", text: w.title }));
      b.addEventListener("click", function () { choose(i, true); });
      books[i] = b;
      var slot = el("li", { class: "slot" }, b);
      if (n === g.items.length - 1) {   // 칸의 마지막 책 옆에 북엔드
        slot.append(svg("bookend", "0 0 40 104", '<path d="M0 0h8v96h32v8H0z" fill="#3A4047"/><path d="M0 0h3v104H0z" fill="#636C76"/><path d="M8 96h32v2H8z" fill="#59616A"/>'));
        lastSlot = slot;
      }
      ul.append(slot);
    });
    if (gi === groups.length - 1) {     // 맨 아래 칸 끝에 소품
      decor = el("li", { class: "slot decor", "aria-hidden": "true" },
        svg("flask", "0 0 80 110", '<path d="M20 70h40l10.500 23c3 7-2 11-9 11H18.500c-7 0-12-4-9-11z" fill="#43B9A9"/><circle cx="34" cy="84" r="3" fill="#BFF0E8"/><circle cx="47" cy="92" r="2" fill="#BFF0E8"/><path d="M29 6h22M34 6v30L10 92c-4 9 2 14 10 14h40c8 0 14-5 10-14L46 36V6" fill="rgba(255,255,255,.14)" stroke="#E4ECEA" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M40 44l-17 40" stroke="rgba(255,255,255,.5)" stroke-width="3" stroke-linecap="round" fill="none"/>'),
        svg("plant", "0 0 90 120", '<path d="M45 80C31 61 19 53 7 51c2 15 15 27 38 29z" fill="#3E7C4F"/><path d="M45 80c12-23 26-31 39-33-2 17-15 29-39 33z" fill="#3E7C4F"/><path d="M45 80C39 51 43 31 52 13c9 19 5 46-7 67z" fill="#56A06B"/><path d="M24 84h42l-5 34H29z" fill="#E6E0D2"/><path d="M21 76h48v11H21z" fill="#F7F3E8"/><path d="M29 118h32l1-6H28z" fill="rgba(0,0,0,.12)"/>'));
      ul.append(decor);
    }
    shelves.append(ul);
  });
  count.textContent = "지금 " + list.length + "권이 꽂혀 있어요.";

  // 소품만 혼자 다음 줄로 밀려나면 빈 선반처럼 보이므로 그때는 치운다
  function tidy() {
    if (!decor || !lastSlot) return;
    decor.hidden = false;
    if (decor.offsetTop > lastSlot.offsetTop + 4) decor.hidden = true;
  }
  tidy();
  window.addEventListener("resize", tidy);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(tidy);

  // 뽑은 책의 표지 채우기
  function fill(target, i) {
    var w = list[i];
    var go = { href: w.url, target: "_blank", rel: "noopener noreferrer" };
    var len = Array.from(w.title).length;
    var withPhoto = w.image && !broken[i];
    var front = el("div", { class: "front cloth" + (withPhoto ? "" : " typo" + (len > 22 ? " longer" : len > 10 ? " long" : "")) });
    if (withPhoto) {
      var img = el("img", { src: w.image, alt: w.title + " 첫 화면" });
      img.addEventListener("error", function () {   // 사진 파일이 없으면 글씨 표지로 바꾼다
        broken[i] = true;
        if (current !== i) return;
        var held = document.activeElement, inStage = bk.contains(held), inViewer = bk2.contains(held);
        fill(bk, i);
        if (viewer.open) fill(bk2, i);
        var back = inViewer ? bk2.querySelector(".go") : inStage ? bk.querySelector(".go") : null;
        if (back) back.focus({ preventScroll: true });
      });
      front.append(
        el("a", Object.assign({ class: "plate", tabindex: "-1", "aria-label": w.title + " 열어 보기" }, go), img),
        el("h2", { class: "ct" + (len > 18 ? " small" : ""), text: w.title }));
    } else {
      front.append(el("span", { class: "rule" }), el("h2", { class: "ct", text: w.title }), el("span", { class: "rule" }));
    }
    if (w.description) front.append(el("p", { class: "cd", text: w.description }));
    front.append(el("a", Object.assign({ class: "go" }, go), "열어 보기"));
    target.setAttribute("style", paint(i));
    target.replaceChildren(el("div", { class: "side cloth", "aria-hidden": "true" }), front);
  }

  // 책장에서 뽑혀 나와 표지가 보이게 돌아서는 움직임
  function fly(from, book, wrap) {
    var a = from.getBoundingClientRect(), b = wrap.getBoundingClientRect();
    var W = book.offsetWidth, H = book.offsetHeight, T = parseFloat(getComputedStyle(book).getPropertyValue("--T")) || 52, P = 2200;
    if (!W || !H) return;
    var s = a.height / H;
    s = s * (P - (W / 2) * s) / P;
    var dx = a.left + a.width / 2 - (b.left + b.width / 2) + (T / 2) * s;
    var dy = a.top + a.height / 2 - (b.top + b.height / 2);
    function at(x, y, k, deg) { return "translate3d(" + x + "px," + y + "px,0) perspective(" + P + "px) scale(" + k + ") rotateY(" + deg + "deg)"; }
    book.animate([
      { transform: at(dx, dy, s, 90) },
      { transform: at(dx * .96, dy - 44, s * 1.08, 90), offset: .24 },
      { transform: at(0, 0, 1, 22) },
    ], { duration: 860, easing: "cubic-bezier(.3, .6, .2, 1)" });
  }

  // 책장 위의 책 자리가 화면에 충분히 보이는가
  function stageInView() {
    var r = stage.getBoundingClientRect();
    var seen = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
    return r.height > 0 && seen / r.height >= .75;
  }

  function choose(i, byUser) {
    if (!list[i]) return;
    var before = current;
    if (i !== current) {
      current = i;
      books.forEach(function (b, j) { b.setAttribute("aria-pressed", String(j === i)); });
      fill(bk, i);
    }
    if (!byUser) return;
    if (before >= 0 && before !== i) {
      var old = books[before];
      old.classList.remove("returning"); void old.offsetWidth; old.classList.add("returning");
    }
    var move = !still.matches && typeof bk.animate === "function";
    if (stageInView()) {
      if (move && before !== i) fly(books[i], bk, stage);
    } else if (typeof viewer.showModal === "function") {
      // 책장 위가 안 보이는 곳(휴대폰, 아래 선반)에서는 화면 가운데에 띄운다
      fill(bk2, i);
      if (!viewer.open) viewer.showModal();
      var open = bk2.querySelector(".go");
      if (open) open.focus({ preventScroll: true });
      if (move) fly(books[i], bk2, hold);
    } else {
      stage.scrollIntoView({ block: "nearest", behavior: still.matches ? "auto" : "smooth" });
    }
  }

  // 띄운 책 바깥(어두운 곳)을 누르면 닫힌다
  viewer.addEventListener("click", function (e) {
    if (e.target === viewer || (e.target.classList && e.target.classList.contains("viewer-in"))) viewer.close();
  });

  function fromHash() {
    return Math.min(Math.max((parseInt(location.hash.slice(1), 10) || 1) - 1, 0), list.length - 1);
  }
  choose(fromHash(), false);
  window.addEventListener("hashchange", function () { choose(fromHash(), true); });
})();
