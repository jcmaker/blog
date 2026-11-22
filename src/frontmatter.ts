import { parse, stringify } from 'yaml';

// 글 파일(index.md)을 글머리(frontmatter)와 본문으로 나누고 다시 합친다. 글쓰기 화면(/admin)이 쓴다.
export type PostFile = { data: Record<string, unknown>; body: string };

export function parsePost(text: string): PostFile {
	const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	if (!match) return { data: {}, body: text };
	return { data: parse(match[1]) ?? {}, body: match[2].replace(/^\s+/, '') };
}

export function serializePost({ data, body }: PostFile) {
	return `---\n${stringify(data)}---\n\n${body.trim()}\n`;
}
