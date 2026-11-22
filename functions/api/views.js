// 글 조회수 (Cloudflare Pages Function).
//   GET  /api/views            → { 글주소: 조회수, … }
//   POST /api/views?slug=주소  → 1 올리고 { views: 조회수 }
// env.DB는 Pages 프로젝트 설정에서 연결한 D1 데이터베이스(변수 이름 DB)다. 표는 처음 쓸 때 만들어진다.
// ponytail: 봇도 함께 센다. 숫자가 눈에 띄게 부풀면 User-Agent로 거른다.

const CREATE = 'CREATE TABLE IF NOT EXISTS views (slug TEXT PRIMARY KEY, count INTEGER NOT NULL)';

async function withTable(db, run) {
	try {
		return await run();
	} catch (error) {
		if (!String(error).includes('no such table')) throw error;
		await db.exec(CREATE);
		return run();
	}
}

export async function onRequestGet({ env }) {
	const { results } = await withTable(env.DB, () => env.DB.prepare('SELECT slug, count FROM views').all());
	return Response.json(Object.fromEntries(results.map((row) => [row.slug, row.count])), {
		headers: { 'Cache-Control': 'no-store' },
	});
}

export async function onRequestPost({ request, env }) {
	const slug = new URL(request.url).searchParams.get('slug') ?? '';
	// 실제로 있는 글만 센다. 글 목록은 빌드할 때 만든 search.json에서 읽는다.
	const posts = await env.ASSETS.fetch(new URL('/search.json', request.url)).then((res) => res.json());
	if (!posts.some((post) => post.slug === slug)) return Response.json({ error: 'unknown post' }, { status: 404 });

	const row = await withTable(env.DB, () =>
		env.DB.prepare('INSERT INTO views (slug, count) VALUES (?, 1) ON CONFLICT(slug) DO UPDATE SET count = count + 1 RETURNING count')
			.bind(slug)
			.first(),
	);
	return Response.json({ views: row.count });
}
