import { type CollectionEntry, getCollection } from 'astro:content';

// 발행된 글만 최신순으로. 초안(draft: true)은 개발 서버에서만 보인다.
export async function getPosts() {
	const posts = await getCollection('blog', ({ data }) => !import.meta.env.PROD || !data.draft);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

// ponytail: 글자 수만 센 어림값(분당 500자). 코드가 많은 글에서 어긋나면 본문만 세도록 바꾼다.
export function readingMinutes(post: CollectionEntry<'blog'>) {
	return Math.max(1, Math.round((post.body ?? '').length / 500));
}
