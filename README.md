# justinit

Astro로 만든 개인 블로그. Cloudflare Pages에 배포한다 (`main`에 push하면 자동 배포).

## 폴더 구조

```
src/
  content/blog/   글. 글 하나가 폴더 하나 (index.md + 이미지)
  pages/          주소가 되는 파일. admin.astro가 글쓰기 화면
  components/     화면 조각 (머리줄, 글 목록, 썸네일, 활동 기록 …)
  layouts/        모든 페이지의 공통 틀
  lib/            공용 코드: 글 불러오기(posts), 그림(art), 글머리 읽기·쓰기(frontmatter)
  styles/         tokens.css(색·모양 값)와 global.css(스타일)
functions/        Cloudflare Pages Function. 지금은 조회수 하나
public/           파비콘
docs/             결정 기록(adr/)과 디자인 시스템 문서
```

- 왜 이렇게 만들었는지: [docs/adr](docs/adr/README.md)
- 색, 글자, 구성 요소의 규칙: [docs/design-system.md](docs/design-system.md)

## 글 쓰기

글 하나가 폴더 하나다: `src/content/blog/<주소>/index.md`. 이미지는 같은 폴더에 둔다.

### 웹에서 쓰기

https://blog.justincho.dev/admin/ 에 접속해 GitHub 토큰으로 로그인한다. 토큰은 fine-grained personal access token으로, 이 저장소의 Contents 읽기·쓰기 권한만 준다. 토큰은 그 브라우저에만 저장된다.

왼쪽에 쓰면 오른쪽에 미리보기가 나온다. 저장하면 GitHub API로 저장소에 커밋되고 자동 배포된다. 이미지는 끌어다 놓으면 저장할 때 글과 같은 폴더에 올라간다. "초안"을 켜고 저장하면 블로그에는 보이지 않는다.

화면은 `src/pages/admin.astro` 한 파일이다. 서버가 없고, 저장소 이름과 브랜치는 그 파일 위쪽 상수에 있다. 글 형식은 `src/content.config.ts`에 있으니 필드를 바꿀 때는 둘을 같이 고친다. 저장된 글의 주소 변경과 글 삭제는 화면에서 못 하고 저장소에서 직접 한다.

### 에디터에서 쓰기

```md
---
title: '제목'
description: '목록과 검색 결과에 보이는 한 줄 요약'
pubDate: 2026-11-22
category: tech        # 영문 소문자. 새 값을 쓰면 카테고리 페이지가 생긴다
tags: [astro]         # 선택
thumb: 3              # 선택. 썸네일 번호 1~25. 비우면 자동
draft: true           # 선택. true면 배포본에서 숨겨지고 개발 서버에서만 보인다
---
```

VS Code나 Cursor에서 이미지를 붙여넣으면 글과 같은 폴더에 저장된다. 컴포넌트를 넣어야 하는 글만 `.mdx`로 쓴다.

## 검색, 조회수, 활동 기록

- 검색(`/search/`): 빌드할 때 `search.json`을 만들고 브라우저에서 거른다.
- 조회수: `functions/api/views.js`(Cloudflare Pages Function)가 D1 데이터베이스 `justinit-blog`에 센다. Pages 프로젝트 설정의 Bindings에 변수 이름 `DB`로 연결되어 있다. 로컬 개발 서버에서는 표시되지 않는다.
- 활동 기록(홈의 점 365개): 빌드할 때 `src/content/blog`를 건드린 커밋을 git 기록에서 날짜별로 센다.

## 명령

- `npm run dev` 개발 서버
- `npm run build` `dist/`에 빌드
- `npm test` 글머리 읽기·쓰기, 조회수 세기 검사
