# blog.justincho.dev

Astro로 만든 개인 블로그. Cloudflare Pages에 배포한다 (`main`에 push하면 자동 배포).

## 글 쓰기

글 하나가 폴더 하나다: `src/content/blog/<주소>/index.md`. 이미지는 같은 폴더에 둔다.

### 웹에서 쓰기

https://blog.justincho.dev/admin/ 에 접속해 "Sign In with Token"으로 로그인한다. 토큰은 GitHub의 fine-grained personal access token으로, 이 저장소의 Contents 읽기·쓰기 권한만 준다. 왼쪽에 쓰면 오른쪽에 미리보기가 나오고, 저장하면 저장소에 커밋되어 자동 배포된다.

로컬에서는 `npm run dev` 후 Chrome에서 http://localhost:4321/admin/index.html 을 열고 "Work with Local Repository"로 이 폴더를 고르면 로그인 없이 쓸 수 있다.

화면 구성은 `public/admin/config.yml`, 글 형식은 `src/content.config.ts`에 있다. 필드를 바꿀 때는 둘을 같이 고친다.

### 에디터에서 쓰기

```md
---
title: '제목'
slug: my-post         # 주소. 폴더 이름과 같게
description: '목록과 검색 결과에 보이는 한 줄 요약'
pubDate: 2026-11-22
category: tech        # 영문 소문자. 새 값을 쓰면 카테고리 페이지가 생긴다
tags: [astro]         # 선택
draft: true           # 선택. true면 배포본에서 숨겨지고 개발 서버에서만 보인다
---
```

VS Code나 Cursor에서 이미지를 붙여넣으면 글과 같은 폴더에 저장된다. 컴포넌트를 넣어야 하는 글만 `.mdx`로 쓴다.

## 명령

- `npm run dev` 개발 서버
- `npm run build` `dist/`에 빌드
