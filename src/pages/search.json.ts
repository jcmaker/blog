import { getPosts } from '../lib/posts';

// 검색 페이지(/search/)가 받아 가는 글 목록. 빌드할 때 한 번 만들어진다.
export async function GET() {
	const posts = await getPosts();
	return Response.json(
		posts.map((post) => ({
			slug: post.id,
			title: post.data.title,
			description: post.data.description,
			category: post.data.category,
			tags: post.data.tags,
			date: post.data.pubDate.toISOString().slice(0, 10),
			// 본문에서 Markdown 기호를 덜어 낸 글자
			text: (post.body ?? '').replace(/```|[#>*_`~\[\]()!|-]+/g, ' ').replace(/\s+/g, ' ').trim(),
		})),
	);
}
