import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parsePost, serializePost } from './frontmatter.ts';

test('글을 읽고 다시 써도 내용이 그대로다', () => {
	const source = `---
title: '따옴표: 와 # 기호'
slug: hello
pubDate: 2026-11-22
tags: [astro, 회고]
draft: true
---

본문 첫 줄

--- 본문 안의 구분선
`;
	const post = parsePost(source);
	assert.equal(post.data.title, '따옴표: 와 # 기호');
	assert.equal(post.data.pubDate, '2026-11-22'); // 날짜가 시각으로 바뀌면 안 된다
	assert.deepEqual(post.data.tags, ['astro', '회고']);
	assert.equal(post.body, '본문 첫 줄\n\n--- 본문 안의 구분선\n');
	assert.deepEqual(parsePost(serializePost(post)), post);
});

test('글머리가 없는 파일은 전부 본문이다', () => {
	assert.deepEqual(parsePost('그냥 글'), { data: {}, body: '그냥 글' });
});
