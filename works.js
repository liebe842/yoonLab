/* ─────────────────────────────────────────────────────────────
   yoonLab 작품 목록
   전시관에 꽂힌 책은 모두 이 파일에서 나옵니다. 고칠 곳은 이 파일 하나뿐입니다.

   ■ 새 작품을 추가하려면
     1. 아래 견본 묶음을 { 부터 }, 까지 그대로 복사합니다.
     2. "const WORKS = [" 아래의 작품들 사이, 넣고 싶은 자리에 붙입니다.
        (다른 작품의 }, 바로 다음 줄에 붙이면 됩니다.)
     3. 큰따옴표 안의 글자만 바꿉니다.

  {
    title: "작품 제목",
    description: "작품을 한 줄로 소개하는 글",
    url: "https://작품주소",
    shelf: "웹앱",
    image: "shots/사진파일이름.jpg",
  },

     title        책등과 표지에 보일 제목 (꼭 적어야 함)
     description  표지에 보일 한 줄 설명
     url          작품 주소. https:// 로 시작해야 함 (꼭 적어야 함)
     shelf        꽂을 칸 이름. 새 이름을 쓰면 새 칸이 생김. 이 줄을 지우면 "웹앱" 칸에 꽂힘
     image        표지 사진. 사진이 없으면 이 줄을 통째로 지우세요 (제목 글씨로 꾸민 표지가 됨)

   ■ 지킬 것
     - 묶음은 { 로 시작해서 }, 로 끝납니다. 줄마다 끝에 쉼표(,)가 있어야 합니다.
     - 글자는 반드시 큰따옴표(" ") 안에 적습니다.
     - 같은 칸 안에서는 여기 적힌 순서대로 왼쪽부터 꽂힙니다.
       칸은 목록에 처음 나온 순서대로 위에서부터 놓입니다.
   ───────────────────────────────────────────────────────────── */

const WORKS = [

  // ── 웹앱 칸 ──────────────────────────────────────────────
  {
    title: "읽걷쓰AI 수업 설계 에이전트",
    description: "교사의 생각을 묻고 점검하며 프로젝트 수업 세안을 함께 완성합니다.",
    url: "https://hah-agent.vercel.app",
    shelf: "웹앱",
    image: "shots/hah-agent.jpg",
  },
  {
    title: "러닝크루 마을",
    description: "선생님들이 배운 것을 나누고, 미션을 풀며 함께 자라는 마을",
    url: "https://learning-crew-village.web.app",
    shelf: "웹앱",
    image: "shots/learning-crew.jpg",
  },
  {
    title: "유퀴즈 온더클래스",
    description: "학생이 질문을 만들고 친구 질문에 답하며, 선생님과 AI가 함께 피드백하는 교실용 실시간 학습 웹앱",
    url: "https://youquiz.fly.dev",
    shelf: "웹앱",
    image: "shots/youquiz.jpg",
  },
  {
    title: "ScienceCoLab",
    description: "학교 간 공동 탐구. 함께 측정하고, 함께 발견해요.",
    url: "https://liebe842.github.io/ScienceCoLab/",
    shelf: "웹앱",
    image: "shots/sciencecolab.jpg",
  },
  {
    title: "보이스위키",
    description: "말하면 위키에 쌓입니다.",
    url: "https://liebe842.github.io/voiceWiki/",
    shelf: "웹앱",
    image: "shots/voicewiki.jpg",
  },
  {
    title: "Hello, Class!",
    description: "AI 기반 스마트 학급 관리 시스템",
    url: "https://hello-class-nine.vercel.app",
    shelf: "웹앱",
    image: "shots/hello-class.jpg",
  },
  {
    title: "오늘의 한 줄",
    description: "오늘 수업에서 배운 것을 한 줄로 남기는 칠판",
    url: "https://guestbook-nu-eight.vercel.app",
    shelf: "웹앱",
    image: "shots/guestbook.jpg",
  },
  {
    title: "우리들의 게시판",
    description: "선생님들이 만든 웹 앱과 소개를 자유롭게 공유하는 게시판",
    url: "https://script.google.com/macros/s/AKfycbyEHcwBmNcIvoUGeUdhPmIm797VV0FMrWeZCNeUN6javuRIZJMEVPC6NNTFh9RRZEV4iQ/exec",
    shelf: "웹앱",
    image: "shots/board-gas.jpg",
  },
  {
    title: "다했니?",
    description: "통합 과제 관리 시스템",
    url: "https://liebe842.github.io/classboard/",
    shelf: "웹앱",
    image: "shots/classboard.jpg",
  },
  {
    title: "여름방학 과제 빙고",
    description: "칸을 누르면 과제를 올릴 수 있고, 제출한 칸이 모이면 빙고가 되는 여름방학 과제판",
    url: "https://bit.ly/새싹여름방학",
    shelf: "웹앱",
  },
  {
    title: "학생 과제 체크리스트",
    description: "학생들의 과제 제출을 확인하는 체크리스트",
    url: "https://liebe842.github.io/assignment-checker/",
    shelf: "웹앱",
  },
  {
    title: "너희 반 앱",
    description: "우리 반을 위한 학급 앱",
    url: "https://class-log-rose.vercel.app",
    shelf: "웹앱",
  },
  {
    title: "러닝 챌린지 인증",
    description: "러닝 챌린지 참가자들의 인증 시스템",
    url: "https://runmate-challenge.web.app",
    shelf: "웹앱",
    image: "shots/running-challenge.jpg",
  },
  {
    title: "VibeLog",
    description: "코딩 챌린지 기록을 나누는 피드",
    url: "https://vibe-log-one.vercel.app",
    shelf: "웹앱",
    image: "shots/vibelog.jpg",
  },
  {
    title: "Body Volleyball Game",
    description: "카메라 앞에서 몸을 움직여 하는 배구 게임",
    url: "https://liebe842.github.io/valleyBall/",
    shelf: "웹앱",
  },

  // ── 수업·연수 자료 칸 ─────────────────────────────────────
  {
    title: "우리 수업에 필요한 AI 도구 만들기",
    description: "AI융합교육 수업설계 전문가 과정(2기) 직무연수 자료. AI에게 요청해 진짜 웹앱을 만들고, 고치고, 나눠요.",
    url: "https://liebe842.github.io/261114_vibecoding-ppt/",
    shelf: "수업·연수 자료",
    image: "shots/ppt-ai-tools.jpg",
  },
  {
    title: "내 교실을 위한 첫 웹앱 만들기",
    description: "2026 읽걷쓰AI 리더십 실전 워크숍 자료. 코딩 없이 말로 만드는 학교 업무 도구",
    url: "https://liebe842.github.io/ai-leadership-workshop-2026-ppt/",
    shelf: "수업·연수 자료",
    image: "shots/ppt-first-webapp.jpg",
  },
  {
    title: "Apps Script와 제미나이로 쉽게 바이브코딩 하기",
    description: "읽걷쓰 AI디지털 역량 강화 교원 연수 자료",
    url: "https://liebe842.github.io/vibecoding-ppt/",
    shelf: "수업·연수 자료",
    image: "shots/ppt-vibecoding.jpg",
  },
  {
    title: "선생님을 위한 클로드코드 기초",
    description: "1차시. 설치부터 웹앱 계획서까지",
    url: "https://liebe842.github.io/claudecode-ppt/",
    shelf: "수업·연수 자료",
    image: "shots/ppt-claudecode.jpg",
  },
  {
    title: "머신러닝을 활용하여 AI 운동 코치 만들기",
    description: "마이크로비트 AI가 내 운동을 알아보고 운동한 시간을 재 줘요. 주말 코딩 캠프 수업 자료",
    url: "https://liebe842.github.io/microbit-ai-coach/",
    shelf: "수업·연수 자료",
    image: "shots/ppt-microbit.jpg",
  },
  {
    title: "랜덤 가위바위보 만들기",
    description: "엔트리 코딩 교실. 컴퓨터와 가위바위보 대결!",
    url: "https://liebe842.github.io/rps-slides/",
    shelf: "수업·연수 자료",
    image: "shots/ppt-rps.jpg",
  },
  {
    title: "유퀴즈 온더클래스 발표 자료",
    description: "질문하는 학생, 함께 성장하는 교실",
    url: "https://liebe842.github.io/ppt/",
    shelf: "수업·연수 자료",
    image: "shots/ppt-youquiz.jpg",
  },

];
