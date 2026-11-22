import { getCollection } from 'astro:content';

// 발행된 글만 최신순으로. 초안(draft: true)은 개발 서버에서만 보인다.
export async function getPosts() {
	const posts = await getCollection('blog', ({ data }) => !import.meta.env.PROD || !data.draft);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
