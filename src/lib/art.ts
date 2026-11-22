// 배너와 썸네일의 "쌓기" 그림을 SVG로 그린다. 그림 파일은 없다.
//   배너   = 입체 블록: 비스듬히 내려다본 블록이 오른쪽으로 갈수록 높이 쌓인다.
//   썸네일 = 모이는 조각: 작은 조각이 한쪽 구석으로 모여 덩어리가 된다.
// 반투명을 쓰면 겹친 면이 비쳐 보이므로, 색은 바탕색과 섞어서(color-mix) 불투명하게 만든다.

// 같은 씨앗이면 언제나 같은 그림이 나온다.
function rng(seed: number) {
	return () => {
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
const clamp = (value: number) => Math.max(0, Math.min(1, value));

/** ink: 블록 색, lit: 빛나는 블록 색, ground: 섞을 바탕색 */
type Palette = { ink: string; lit: string; ground: string };
const mix = (color: string, percent: number, { ground }: Palette) => `color-mix(in oklab, ${color} ${Math.round(percent)}%, ${ground})`;

// ── 배너: 입체 블록 ──
// 마름모 격자의 칸마다 높이가 다른 기둥을 세우고, 뒤쪽 줄부터 앞으로 그려 가린다.
// 처음 들어올 때 기둥이 차례로 내려앉고(.art-in), 빛나는 꼭대기는 천천히 깜빡인다(.art-lit). 움직임은 global.css에 있다.
function isoBlocks(width: number, palette: Palette) {
	const random = rng(11);
	const halfW = 22; // 윗면 마름모의 가로 절반
	const halfH = 11; // 윗면 마름모의 세로 절반
	const level = 20; // 한 층의 높이
	const from = 400; // 이 x부터 오른쪽으로 갈수록 높아진다
	let out = '';
	for (let row = 0; row <= 20; row++) {
		for (let col = -22; col <= 22; col++) {
			if ((col + row) & 1) continue;
			const x = 800 + col * halfW;
			const y = 140 + row * halfH;
			const r1 = random();
			const r2 = random();
			const r3 = random();
			const t = clamp((x - from) / (width - from));
			const levels = r2 < 0.28 ? 0 : Math.round(7 * Math.pow(t, 1.4) * (0.3 + 0.7 * r1));
			const depth = 0.55 + (0.45 * row) / 20; // 뒤쪽 줄일수록 어둡다
			if (levels === 0) {
				// 빈 칸은 바닥의 격자 선만 남긴다.
				if (t > 0.05) out += `<path d="M${x} ${y - halfH}L${x + halfW} ${y}L${x} ${y + halfH}L${x - halfW} ${y}Z" fill="none" style="stroke:${mix(palette.ink, 16 * depth, palette)}"/>`;
				continue;
			}
			const lit = r3 < 0.13 && levels >= 2;
			const color = lit ? palette.lit : palette.ink;
			const top = y - levels * level;
			let column = '';
			for (let k = 0; k < levels; k++) {
				const yk = y - k * level;
				const shade = depth * (0.75 + (0.25 * (k + 1)) / levels);
				column += `<path d="M${x - halfW} ${yk - level}L${x} ${yk + halfH - level}L${x} ${yk + halfH}L${x - halfW} ${yk}Z" style="fill:${mix(color, 46 * shade, palette)}"/>`;
				column += `<path d="M${x + halfW} ${yk - level}L${x} ${yk + halfH - level}L${x} ${yk + halfH}L${x + halfW} ${yk}Z" style="fill:${mix(color, 26 * shade, palette)}"/>`;
			}
			const glow = lit ? `;filter:drop-shadow(0 0 9px ${palette.lit})` : '';
			column += `<path${lit ? ' class="art-lit"' : ''} d="M${x} ${top - halfH}L${x + halfW} ${top}L${x} ${top + halfH}L${x - halfW} ${top}Z" style="fill:${mix(color, lit ? 100 : 82 * depth, palette)}${glow}"/>`;
			out += `<g class="art-in" style="animation-delay:${(0.5 * t + 0.25 * r1).toFixed(2)}s">${column}</g>`;
		}
	}
	return out;
}

/** 머리 영역 배너. viewBox는 0 0 1180 300 */
export const banner = isoBlocks(1180, { ink: 'var(--c3)', lit: 'var(--sky)', ground: 'var(--hero)' });

// ── 썸네일: 모이는 조각 ──
// 칸마다 조각이 있을 확률 p가 한쪽 구석으로 갈수록 커진다. kx·ky가 방향, cut이 덩어리의 크기를 정한다.
type Shape = { cell: number; kx: number; ky: number; cut: number };

function gathering(width: number, height: number, seed: number, palette: Palette, { cell, kx, ky, cut }: Shape) {
	const random = rng(seed);
	const cols = Math.ceil(width / cell);
	const rows = Math.ceil(height / cell);
	let out = '';
	for (let col = 0; col < cols; col++) {
		for (let row = 0; row < rows; row++) {
			const r1 = random();
			const r2 = random();
			const r3 = random();
			const p = clamp((((col + 0.5) / cols) * kx + ((row + 0.5) / rows) * ky - cut) * 2.4);
			if (r1 >= p) continue;
			const lit = r3 < 0.05 * p + 0.008;
			const fill = lit ? palette.lit : mix(palette.ink, 14 + 70 * p * (0.35 + 0.65 * r2), palette);
			const glow = lit ? `;filter:drop-shadow(0 0 ${(cell * 0.45).toFixed(1)}px ${palette.lit})` : '';
			out += `<rect x="${col * cell + 1}" y="${row * cell + 1}" width="${cell - 2}" height="${cell - 2}" rx="${(cell * 0.16).toFixed(1)}" style="fill:${fill}${glow}"/>`;
		}
	}
	return out;
}

// 바탕색 다섯 가지 × 모이는 모양 다섯 가지. 번호를 고르지 않으면 글 주소로 하나가 정해진다.
const SKINS: (Palette & { bg: string })[] = [
	{ bg: 'var(--navy)', ground: 'var(--navy)', ink: 'var(--c3)', lit: 'var(--sky)' },
	{ bg: 'var(--c5)', ground: 'var(--c5)', ink: 'var(--c1)', lit: '#3350c0' },
	// 그라데이션 바탕은 한 색으로 섞을 수 없어서 가운데쯤의 색을 쓴다.
	{ bg: 'url(#brand)', ground: '#4180da', ink: '#fff', lit: '#fff' },
	{ bg: 'var(--c1)', ground: 'var(--c1)', ink: 'var(--c4)', lit: 'var(--sky)' },
	{ bg: 'var(--c4)', ground: 'var(--c4)', ink: 'var(--c1)', lit: 'var(--navy)' },
];
const SHAPES: Shape[] = [
	{ cell: 12, kx: 1.2, ky: 0.9, cut: 0.75 },
	{ cell: 16, kx: 0.4, ky: 1.5, cut: 0.7 },
	{ cell: 10, kx: 1.5, ky: 0.5, cut: 0.8 },
	{ cell: 12, kx: 0.9, ky: 1.1, cut: 0.55 },
	{ cell: 14, kx: 1.4, ky: 1.0, cut: 1.05 },
];

/** 고를 수 있는 썸네일 수. 글머리의 thumb: 1 ~ THUMB_COUNT */
export const THUMB_COUNT = SKINS.length * SHAPES.length;

/** 썸네일 SVG의 안쪽(viewBox 0 0 300 200). pick(글머리의 thumb)이 있으면 그 번호의 그림, 없으면 글 주소로 정해지는 그림. */
export function thumbnail(slug: string, pick?: number) {
	const n = pick ? pick - 1 : [...slug].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
	const skin = SKINS[n % SKINS.length];
	const shape = SHAPES[Math.floor(n / SKINS.length) % SHAPES.length];
	return (
		'<defs><linearGradient id="brand" x1="0" x2="1"><stop offset="0" stop-color="#4fb4f5"/><stop offset="1" stop-color="#3350c0"/></linearGradient></defs>' +
		`<rect width="300" height="200" style="fill:${skin.bg}"/>` +
		gathering(300, 200, n + 1, skin, shape)
	);
}
