import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { Box, useTheme } from "@mui/material";
import Globe from "react-globe.gl";
import { LocationData, GlobeConfig } from "../../types/location-type";
import { pickVisibleLabels, LabelBox } from "./globe-utils";
import { createStarfield, disposeStarfield } from "./starfield";
import EarthTexture8k from "../../assets/images/globe/earth-apple-8k.webp";
import EarthTexture4k from "../../assets/images/globe/earth-apple-4k.webp";

interface ArcData {
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
    path: string;
}

interface GlobeComponentProps {
    locations: LocationData[];
    selectedLocationId: string | null;
    onLocationSelect: (locationId: string) => void;
    config: GlobeConfig;
    arcs?: Array<{ startCity: string; endCity: string; path: string }>;
    className?: string;
}

// Below this camera altitude city labels show (decluttered); above it only the
// selected or hovered one does.
const LABEL_ALTITUDE = 1.2;

// Stars sit far outside the globe (radius 100) but inside the camera's far plane.
const STAR_COUNT = 20000;
const STAR_RADIUS = 20000;
const STAR_SEED = 20260922;

const ARC_COLORS: Record<string, string> = {
    Flight: "255, 255, 255",
    Land: "255, 159, 10",
    Sea: "100, 210, 255",
};

const MARKER_CSS = `
.globe-marker {
    position: relative;
    width: 0;
    height: 0;
    pointer-events: auto;
    cursor: pointer;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
}
.globe-marker__dot {
    position: absolute;
    left: -7px;
    top: -7px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--marker-color);
    border: 2px solid #fff;
    box-sizing: border-box;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.45);
    transition: transform 200ms ease;
}
.globe-marker:hover .globe-marker__dot,
.globe-marker--selected .globe-marker__dot {
    transform: scale(1.35);
}
.globe-marker--selected .globe-marker__dot::after {
    content: "";
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    border: 2px solid var(--marker-color);
    animation: globe-marker-pulse 1.8s ease-out infinite;
}
@keyframes globe-marker-pulse {
    from { transform: scale(0.5); opacity: 1; }
    to { transform: scale(1.6); opacity: 0; }
}
.globe-marker__label {
    position: absolute;
    left: 12px;
    top: -10px;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.01em;
    color: #fff;
    text-shadow: 0 0 3px rgba(0, 0, 0, 0.9), 0 1px 2px rgba(0, 0, 0, 0.6);
    opacity: 0;
    transition: opacity 200ms ease;
    pointer-events: none;
}
.globe--labels .globe-marker:not(.globe-marker--label-hidden) .globe-marker__label,
.globe-marker:hover .globe-marker__label,
.globe-marker--selected .globe-marker__label {
    opacity: 1;
}
`;

// Mobile GPUs commonly cap textures at 4096px; only send 8K where it can be used.
const pickEarthTexture = (): string => {
    if (typeof window === "undefined" || window.innerWidth < 900) {
        return EarthTexture4k;
    }
    try {
        const gl = document.createElement("canvas").getContext("webgl");
        const maxSize = gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 0;
        return maxSize >= 8192 ? EarthTexture8k : EarthTexture4k;
    } catch {
        return EarthTexture4k;
    }
};

const GlobeComponent = (props: GlobeComponentProps) => {
    const {
        locations,
        selectedLocationId,
        onLocationSelect,
        config,
        arcs = [],
        className,
    } = props;
    const theme = useTheme();
    const globeRef = useRef<any>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const declutterFrame = useRef<number | null>(null);
    const earthTexture = useMemo(pickEarthTexture, []);
    const [showLabels, setShowLabels] = useState(
        config.initial_point_of_view.altitude < LABEL_ALTITUDE
    );

    const rootSx = {
        width: "100%",
        maxWidth: "100%",
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
        background: "radial-gradient(ellipse at center, #0b1526 0%, #03060c 70%)",
        [theme.breakpoints.down("md")]: {
            height: "70vh",
        },
        [theme.breakpoints.down("sm")]: {
            height: "80vh",
        },
    };

    const locationMap = useMemo(() => {
        const map = new Map<string, LocationData>();
        locations.forEach((loc) => {
            map.set(loc.city_name, loc);
        });
        return map;
    }, [locations]);

    const arcsData = useMemo<ArcData[]>(() => {
        return arcs
            .map((arc) => {
                const startCity = locationMap.get(arc.startCity);
                const endCity = locationMap.get(arc.endCity);

                if (!startCity || !endCity) {
                    return null;
                }

                return {
                    startLat: startCity.lat,
                    startLng: startCity.lng,
                    endLat: endCity.lat,
                    endLng: endCity.lng,
                    path: arc.path,
                };
            })
            .filter((arc) => arc !== null) as ArcData[];
    }, [arcs, locationMap]);

    const getArcColor = (arc: ArcData): string[] => {
        const rgb = ARC_COLORS[arc.path] ?? "255, 69, 58";
        return [`rgba(${rgb}, 0.25)`, `rgba(${rgb}, 0.9)`, `rgba(${rgb}, 0.25)`];
    };

    const getArcAltitude = (arc: ArcData): number =>
        arc.path === "Land" || arc.path === "Sea" ? 0.02 : 0.15;

    useEffect(() => {
        const globe = globeRef.current;
        if (typeof globe?.scene !== "function") {
            return;
        }
        const reduceMotion =
            typeof window.matchMedia === "function" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const stars = createStarfield({
            count: STAR_COUNT,
            radius: STAR_RADIUS,
            seed: STAR_SEED,
            pixelRatio: window.devicePixelRatio || 1,
            twinkle: !reduceMotion,
        });
        globe.scene().add(stars);
        return () => disposeStarfield(stars);
    }, []);

    useEffect(() => {
        if (globeRef.current) {
            const { lat, lng, altitude } = config.initial_point_of_view;
            globeRef.current.pointOfView({ lat, lng, altitude }, config.animation_duration);
        }
    }, [config]);

    // Hide labels that would collide on screen, keeping the selected city's.
    // Measured two frames out so globe.gl has repositioned the markers first.
    const declutterLabels = useCallback(() => {
        if (declutterFrame.current !== null) {
            return;
        }
        declutterFrame.current = requestAnimationFrame(() => {
            declutterFrame.current = requestAnimationFrame(() => {
                declutterFrame.current = null;
                const markers = Array.from(
                    rootRef.current?.querySelectorAll<HTMLElement>(".globe-marker") ?? []
                );
                const boxes: LabelBox[] = [];
                const dots: LabelBox[] = [];
                const measure = (el: Element | null, id: string, into: LabelBox[]) => {
                    // Markers behind the globe are display: none and have no rects.
                    if (el && el.getClientRects().length > 0) {
                        const { left, top, right, bottom } = el.getBoundingClientRect();
                        into.push({ id, left, top, right, bottom });
                    }
                };
                markers.forEach((marker) => {
                    const id = marker.dataset.id ?? "";
                    measure(marker.querySelector(".globe-marker__label"), id, boxes);
                    measure(marker.querySelector(".globe-marker__dot"), id, dots);
                });
                const visible = pickVisibleLabels(
                    boxes,
                    selectedLocationId ? [selectedLocationId] : [],
                    4,
                    dots
                );
                markers.forEach((marker) =>
                    marker.classList.toggle(
                        "globe-marker--label-hidden",
                        !visible.has(marker.dataset.id ?? "")
                    )
                );
            });
        });
    }, [selectedLocationId]);

    useEffect(() => {
        declutterLabels();
        window.addEventListener("resize", declutterLabels);
        return () => window.removeEventListener("resize", declutterLabels);
    }, [declutterLabels]);

    useEffect(
        () => () => {
            if (declutterFrame.current !== null) {
                cancelAnimationFrame(declutterFrame.current);
                declutterFrame.current = null;
            }
        },
        []
    );

    // Read through a ref so a new callback from the parent doesn't rebuild markers.
    const onLocationSelectRef = useRef(onLocationSelect);
    onLocationSelectRef.current = onLocationSelect;

    // globe.gl rebuilds every marker whenever this accessor changes identity,
    // so it must only change with the selection.
    const markerElement = useCallback((d: object): HTMLElement => {
        const location = d as LocationData;
        const el = document.createElement("div");
        el.className = "globe-marker";
        el.dataset.id = location.id;
        if (location.id === selectedLocationId) {
            el.classList.add("globe-marker--selected");
        }
        el.style.setProperty("--marker-color", location.color || "#0a84ff");

        const dot = document.createElement("div");
        dot.className = "globe-marker__dot";
        const label = document.createElement("div");
        label.className = "globe-marker__label";
        label.textContent = location.city_name;
        el.append(dot, label);

        el.addEventListener("click", () => {
            onLocationSelectRef.current(location.id);
            globeRef.current?.pointOfView(
                { lat: location.lat, lng: location.lng, altitude: 1.1 },
                800
            );
        });
        return el;
    }, [selectedLocationId]);

    const htmlElementsData = useMemo(
        () => locations.map((location) => ({ ...location })),
        // A fresh array forces globe.gl to rebuild the markers with the new selection.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [locations, selectedLocationId]
    );

    return (
        <Box ref={rootRef} sx={rootSx} className={`${className || ""} ${showLabels ? "globe--labels" : ""}`}>
            <style>{MARKER_CSS}</style>
            <Globe
                ref={globeRef}
                globeImageUrl={earthTexture}
                backgroundColor="rgba(0, 0, 0, 0)"
                atmosphereColor="#6fb4ff"
                atmosphereAltitude={config.atmosphere_altitude}
                showAtmosphere={true}
                showGraticules={false}
                animateIn={true}
                htmlElementsData={htmlElementsData}
                htmlLat={(d: any) => (d as LocationData).lat}
                htmlLng={(d: any) => (d as LocationData).lng}
                htmlAltitude={0.005}
                htmlElement={markerElement}
                htmlTransitionDuration={0}
                onGlobeReady={declutterLabels}
                onZoom={(pov: any) => {
                    setShowLabels(pov.altitude < LABEL_ALTITUDE);
                    declutterLabels();
                }}
                arcsData={arcsData}
                arcStartLat={(arc: any) => arc.startLat}
                arcStartLng={(arc: any) => arc.startLng}
                arcEndLat={(arc: any) => arc.endLat}
                arcEndLng={(arc: any) => arc.endLng}
                arcColor={(arc: any) => getArcColor(arc)}
                arcAltitude={(arc: any) => getArcAltitude(arc)}
                arcStroke={0.3}
                enablePointerInteraction={true}
                showPointerCursor={true}
            />
        </Box>
    );
};

export default GlobeComponent;
