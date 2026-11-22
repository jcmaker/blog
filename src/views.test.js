import assert from 'node:assert/strict';
import { test } from 'node:test';
import { onRequestGet, onRequestPost } from '../functions/api/views.js';

// D1을 흉내 낸다. 표를 만들기(exec) 전에는 실제 D1처럼 "no such table" 오류를 낸다.
function fakeEnv() {
	const counts = new Map();
	let created = false;
	const guard = () => {
		if (!created) throw new Error('D1_ERROR: no such table: views');
	};
	return {
		DB: {
			exec: async () => void (created = true),
			prepare: () => {
				let slug;
				return {
					bind(value) {
						slug = value;
						return this;
					},
					async first() {
						guard();
						counts.set(slug, (counts.get(slug) ?? 0) + 1);
						return { count: counts.get(slug) };
					},
					async all() {
						guard();
						return { results: [...counts].map(([slug, count]) => ({ slug, count })) };
					},
				};
			},
		},
		ASSETS: { fetch: async () => Response.json([{ slug: 'hello' }]) },
	};
}
const post = (env, slug) => onRequestPost({ env, request: new Request(`https://blog.test/api/views?slug=${slug}`, { method: 'POST' }) });

test('있는 글은 볼 때마다 1씩 오르고, 없는 글은 세지 않는다', async () => {
	const env = fakeEnv();
	assert.deepEqual(await (await post(env, 'hello')).json(), { views: 1 }); // 표가 없던 첫 요청
	assert.deepEqual(await (await post(env, 'hello')).json(), { views: 2 });
	assert.equal((await post(env, 'nope')).status, 404);
	assert.deepEqual(await (await onRequestGet({ env })).json(), { hello: 2 });
});
