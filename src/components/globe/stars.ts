export type StarField = {
    positions: Float32Array;
    colors: Float32Array;
    sizes: Float32Array;
    phases: Float32Array;
};

type StarOptions = {
    count: number;
    radius: number;
    seed: number;
};

// Pole of the Milky Way band, in scene coordinates. Tilted so the band
// crosses the sky diagonally from the default camera position.
const rawNormal = [0.35, 0.82, 0.45];
const normLength = Math.hypot(...rawNormal);
export const MILKY_WAY_NORMAL = rawNormal.map((v) => v / normLength) as [number, number, number];

const BAND_FRACTION = 0.45;
const BAND_SPREAD_RADIANS = (7 * Math.PI) / 180;
const MIN_SIZE = 1.0;
const MAX_SIZE = 4.0;

// Star colours by spectral class, weighted towards white and pale yellow the
// way the naked-eye sky looks. Rows: [r, g, b, weight].
const STAR_COLORS = [
    [0.7, 0.8, 1.0, 0.15],
    [0.85, 0.9, 1.0, 0.25],
    [1.0, 1.0, 1.0, 0.3],
    [1.0, 0.95, 0.85, 0.18],
    [1.0, 0.82, 0.62, 0.12],
];

// mulberry32: small, fast, seedable; fine for decoration.
const createRandom = (seed: number) => {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
};

const gaussian = (random: () => number) =>
    Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());

// Orthonormal basis (u, v) spanning the Milky Way plane.
const bandBasis = () => {
    const [nx, ny, nz] = MILKY_WAY_NORMAL;
    const ux = ny, uy = -nx, uz = 0;
    const ul = Math.hypot(ux, uy, uz);
    const u = [ux / ul, uy / ul, uz / ul];
    const v = [ny * u[2] - nz * u[1], nz * u[0] - nx * u[2], nx * u[1] - ny * u[0]];
    return { u, v };
};

export const generateStars = ({ count, radius, seed }: StarOptions): StarField => {
    const random = createRandom(seed);
    const { u, v } = bandBasis();
    const n = MILKY_WAY_NORMAL;
    const totalWeight = STAR_COLORS.reduce((sum, c) => sum + c[3], 0);

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
        let x: number, y: number, z: number;
        if (random() < BAND_FRACTION) {
            const longitude = 2 * Math.PI * random();
            const latitude = gaussian(random) * BAND_SPREAD_RADIANS;
            const along = Math.cos(latitude);
            const across = Math.sin(latitude);
            x = along * (Math.cos(longitude) * u[0] + Math.sin(longitude) * v[0]) + across * n[0];
            y = along * (Math.cos(longitude) * u[1] + Math.sin(longitude) * v[1]) + across * n[1];
            z = along * (Math.cos(longitude) * u[2] + Math.sin(longitude) * v[2]) + across * n[2];
        } else {
            z = 2 * random() - 1;
            const ring = Math.sqrt(1 - z * z);
            const angle = 2 * Math.PI * random();
            x = ring * Math.cos(angle);
            y = ring * Math.sin(angle);
        }
        positions[i * 3] = x * radius;
        positions[i * 3 + 1] = y * radius;
        positions[i * 3 + 2] = z * radius;

        // Steep power law: the sky is mostly faint stars with a few bright ones.
        sizes[i] = MIN_SIZE + (MAX_SIZE - MIN_SIZE) * Math.pow(random(), 5);

        let pick = random() * totalWeight;
        const color = STAR_COLORS.find((c) => (pick -= c[3]) <= 0) ?? STAR_COLORS[2];
        colors.set(color.slice(0, 3), i * 3);

        phases[i] = 2 * Math.PI * random();
    }

    return { positions, colors, sizes, phases };
};
