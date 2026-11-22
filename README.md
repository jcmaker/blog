# blog.justincho.dev

Astro로 만든 개인 블로그. Cloudflare Pages에 배포한다 (`main`에 push하면 자동 배포).

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

## 명령

- `npm run dev` 개발 서버
- `npm run build` `dist/`에 빌드
- `npm test` 글머리 읽기·쓰기 검사
