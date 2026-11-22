// 배너와 썸네일의 "쌓기" 그림. 블록을 쌓아 올린 모양을 SVG로 그린다. 그림 파일은 없다.

// 같은 씨앗이면 언제나 같은 그림이 나온다.
function rng(seed: number) {
	return () => {
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

type Shape = { cell: number; base: number; rise: number };

/** ink: [꼭대기에서 빛나는 블록 색, 나머지 블록 색]. base·rise: 왼쪽 끝 높이와 오른쪽으로 갈수록 더해지는 높이(0~1). */
export function blocks(width: number, height: number, seed: number, ink: [string, string], { cell, base, rise }: Shape) {
	const random = rng(seed);
	const cols = Math.ceil(width / cell);
	const rows = Math.floor(height / cell);
	const phase1 = random() * 6.28;
	const phase2 = random() * 6.28;
	let out = '';
	for (let col = 0; col < cols; col++) {
		const t = col / cols;
		const high = Math.round(rows * Math.max(0, base + rise * t + 0.16 * Math.sin(t * 9 + phase1) + 0.09 * Math.sin(t * 23 + phase2)));
		for (let row = 0; row < high; row++) {
			const lit = row === high - 1 && random() < 0.4;
			const opacity = lit ? 1 : 0.22 + (0.6 * (row + 1)) / high;
			out += `<rect x="${col * cell + 3}" y="${height - (row + 1) * cell + 3}" width="${cell - 6}" height="${cell - 6}" rx="${cell * 0.2}" style="fill:${ink[lit ? 0 : 1]}" opacity="${opacity.toFixed(2)}"/>`;
		}
	}
	return out;
}

// 머리 영역 배너: 오른쪽으로 갈수록 높아진다.
export const banner = blocks(1180, 300, 8, ['var(--sky)', 'var(--c3)'], { cell: 30, base: -0.25, rise: 1.15 });

// 썸네일: 바탕색 다섯 가지 × 쌓인 모양 다섯 가지. 글 주소로 하나가 정해진다.
const SKINS: { bg: string; ink: [string, string] }[] = [
	{ bg: 'var(--navy)', ink: ['var(--sky)', 'var(--c3)'] },
	{ bg: 'var(--c5)', ink: ['var(--c1)', 'var(--c3)'] },
	{ bg: 'url(#brand)', ink: ['#fff', 'var(--c5)'] },
	{ bg: 'var(--c1)', ink: ['var(--sky)', 'var(--c4)'] },
	{ bg: 'var(--c4)', ink: ['var(--c1)', 'var(--navy)'] },
];
const SHAPES: Shape[] = [
	{ cell: 30, base: 0.1, rise: 0.75 },
	{ cell: 24, base: 0.55, rise: -0.45 },
	{ cell: 36, base: 0.2, rise: 0.5 },
	{ cell: 20, base: 0.3, rise: 0.35 },
	{ cell: 30, base: 0.05, rise: 0.9 },
];

export function thumbnail(slug: string) {
	const n = [...slug].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
	const skin = SKINS[n % SKINS.length];
	const shape = SHAPES[Math.floor(n / SKINS.length) % SHAPES.length];
	return (
		'<defs><linearGradient id="brand" x1="0" x2="1"><stop offset="0" stop-color="#4fb4f5"/><stop offset="1" stop-color="#3350c0"/></linearGradient></defs>' +
		`<rect width="300" height="200" style="fill:${skin.bg}"/>` +
		blocks(300, 200, n, skin.ink, shape)
	);
}
