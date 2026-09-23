export type LabelBox = {
    id: string;
    left: number;
    top: number;
    right: number;
    bottom: number;
};

const overlaps = (a: LabelBox, b: LabelBox, padding: number): boolean =>
    a.left < b.right + padding &&
    b.left < a.right + padding &&
    a.top < b.bottom + padding &&
    b.top < a.bottom + padding;

// Greedy screen-space label placement, the way map apps declutter: priority
// labels claim space first, then the rest in input order. A label is hidden
// if it would overlap a label already placed, or the dot (obstacle) of a city
// ranked before it. Dots of later-ranked cities may be covered, so the most
// important label in a dense cluster survives.
export const pickVisibleLabels = (
    boxes: LabelBox[],
    priorityIds: string[] = [],
    padding = 2,
    obstacles: LabelBox[] = []
): Set<string> => {
    const priority = new Set(priorityIds);
    const ordered = [
        ...boxes.filter((b) => priority.has(b.id)),
        ...boxes.filter((b) => !priority.has(b.id)),
    ];
    const rank = new Map(ordered.map((b, i) => [b.id, i]));
    const placed: LabelBox[] = [];
    ordered.forEach((candidate, i) => {
        const blocked =
            placed.some((p) => overlaps(p, candidate, padding)) ||
            obstacles.some(
                (o) => (rank.get(o.id) ?? Infinity) < i && overlaps(o, candidate, padding)
            );
        if (!blocked) {
            placed.push(candidate);
        }
    });
    return new Set(placed.map((b) => b.id));
};

export type DisplayEnvironment = {
    innerWidth: number;
    devicePixelRatio: number;
    finePointer: boolean;
    // A getter so the WebGL probe only runs when everything else qualifies.
    readonly maxTextureSize: number;
};

// The 8K texture decodes to ~128 MB of GPU memory, so only send it where the
// extra detail is visible and memory is plentiful: large, high-density,
// mouse/trackpad screens. Touch devices (phones, iPads) get 4K.
export const earthTextureSize = (env: DisplayEnvironment): "8k" | "4k" =>
    env.innerWidth >= 1200 &&
    env.devicePixelRatio >= 2 &&
    env.finePointer &&
    env.maxTextureSize >= 8192
        ? "8k"
        : "4k";
