# blog.justincho.dev

Astro로 만든 개인 블로그. Cloudflare Pages에 배포한다 (`main`에 push하면 자동 배포).

## 글 쓰기

`src/content/blog/글-주소.md` 파일을 만든다. 파일 이름이 주소(`/blog/글-주소/`)가 된다.

```md
---
title: '제목'
description: '목록과 검색 결과에 보이는 한 줄 요약'
pubDate: 2026-11-22
category: tech        # 영문 소문자. 새 값을 쓰면 카테고리 페이지가 생긴다
tags: [astro]         # 선택
draft: true           # 선택. true면 배포본에서 숨겨지고 개발 서버에서만 보인다
---
```

컴포넌트를 넣어야 하는 글만 `.mdx`로 쓴다.

## 명령

- `npm run dev` 개발 서버
- `npm run build` `dist/`에 빌드
