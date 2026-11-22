# 0002. Cloudflare Pages에 배포한다

- 상태: 채택
- 날짜: 2026-11-22
- 결정한 사람: Justin

## 맥락

지금까지는 Vercel을 써 왔다. 이번에는 다른 곳을 써 보고 싶었고 Railway, Cloudflare, Fly를 후보로 봤다. 도메인의 DNS는 Vercel에 있고 옮기지 않는다.

## 결정

Cloudflare Pages에 배포한다. `main`에 push하면 자동으로 빌드·배포된다. DNS는 Vercel에 그대로 두고 `blog` CNAME만 `blog-5mf.pages.dev`로 보낸다.

## 검토한 대안

- **Vercel**: 가장 익숙하지만 이번에는 다른 곳을 써 보는 것이 목적이었다.
- **Railway, Fly**: 서버를 띄우는 곳이라 정적 블로그에는 과하고 비용이 든다.
- **Cloudflare Workers**: 커스텀 도메인을 붙이려면 도메인의 네임서버가 Cloudflare에 있어야 한다. Pages는 외부 DNS의 CNAME을 받는다.

## 결과

- 정적 파일 배포는 무료다. 필요해지면 같은 계정의 D1, KV, R2 등을 붙일 수 있고 실제로 조회수에 D1을 쓴다([0012](0012-view-counts-d1.md)).
- 순서 제약이 있다. Pages에 도메인을 먼저 등록한 뒤 CNAME을 추가해야 한다. 반대로 하면 522 오류가 난다.
- Astro 7이 요구하는 Node 버전을 맞추려고 Pages 설정에 `NODE_VERSION=22.23.5`를 넣었다.
- Cloudflare 계정은 개인 계정(Jcmaker0627)을 쓴다.
