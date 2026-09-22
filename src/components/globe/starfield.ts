import {
    AdditiveBlending,
    BufferAttribute,
    BufferGeometry,
    Points,
    ShaderMaterial,
} from "three";
import { generateStars } from "./stars";

const VERTEX_SHADER = `
attribute float size;
attribute float phase;
attribute vec3 color;
uniform float time;
uniform float pixelRatio;
uniform float twinkle;
varying vec3 vColor;
varying float vAlpha;
void main() {
    vColor = color;
    // Brighter stars twinkle a little; faint ones hold steady.
    float flicker = 1.0 - twinkle * smoothstep(1.8, 4.0, size) * (0.5 + 0.5 * sin(time * 1.3 + phase));
    vAlpha = mix(0.7, 1.0, smoothstep(1.0, 2.5, size)) * flicker;
    gl_PointSize = size * pixelRatio;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Soft round star: a bright core with a gentle falloff, no square edges.
const FRAGMENT_SHADER = `
varying vec3 vColor;
varying float vAlpha;
void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float core = exp(-d * d * 4.0);
    gl_FragColor = vec4(vColor, core * vAlpha);
}
`;

type StarfieldOptions = {
    count: number;
    radius: number;
    seed: number;
    pixelRatio: number;
    twinkle: boolean;
};

export const createStarfield = (options: StarfieldOptions): Points => {
    const { positions, colors, sizes, phases } = generateStars(options);
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setAttribute("color", new BufferAttribute(colors, 3));
    geometry.setAttribute("size", new BufferAttribute(sizes, 1));
    geometry.setAttribute("phase", new BufferAttribute(phases, 1));

    const material = new ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            pixelRatio: { value: options.pixelRatio },
            twinkle: { value: options.twinkle ? 0.35 : 0 },
        },
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
    });

    const points = new Points(geometry, material);
    points.frustumCulled = false;
    if (options.twinkle) {
        points.onBeforeRender = () => {
            material.uniforms.time.value = performance.now() / 1000;
        };
    }
    return points;
};

export const disposeStarfield = (points: Points) => {
    points.removeFromParent();
    points.geometry.dispose();
    (points.material as ShaderMaterial).dispose();
};
