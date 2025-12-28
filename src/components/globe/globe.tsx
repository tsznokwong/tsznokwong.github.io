import React, { useRef, useEffect, useMemo } from "react";
import { Theme, Box } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import Globe from "react-globe.gl";
import { LocationData, GlobeConfig } from "../../types/location-type";

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

const GlobeComponent = (props: GlobeComponentProps) => {
    const {
        locations,
        selectedLocationId,
        onLocationSelect,
        config,
        arcs = [],
        className,
    } = props;
    const classes = useStyles();
    const globeRef = useRef<any>(null);

    // Prepare points data with all required properties
    const pointsData = useMemo(() => {
        return locations.map((location) => ({
            ...location,
            lat: location.lat,
            lng: location.lng,
        }));
    }, [locations]);

    // Build location map for arc conversion
    const locationMap = useMemo(() => {
        const map = new Map<string, LocationData>();
        locations.forEach((loc) => {
            map.set(loc.city_name, loc);
        });
        return map;
    }, [locations]);

    // Convert arc city pairs to coordinates
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

    // Get arc color based on path type
    const getArcColor = (arc: ArcData): string => {
        switch (arc.path) {
            case "Flight":
                return "#FFFFFF";
            case "Land":
                return "#FF8C00";
            case "Sea":
                return "#00D4FF";
            default:
                return "#FF0000";
        }
    };

    // Get arc altitude based on path type
    const getArcAltitude = (arc: ArcData): number => {
        switch (arc.path) {
            case "Flight":
                return 0.15;
            case "Land":
            case "Sea":
                return 0.02;
            default:
                return 0.15;
        }
    };

    // Set initial camera position
    useEffect(() => {
        if (globeRef.current) {
            const { lat, lng, altitude } = config.initial_point_of_view;
            globeRef.current.pointOfView({ lat, lng, altitude }, config.animation_duration);
        }
    }, [config]);

    // Handle point click
    const handlePointClick = (point: any) => {
        const typedPoint = point as LocationData;
        onLocationSelect(typedPoint.id);
        // Optionally animate to that location
        if (globeRef.current && typedPoint.lat !== undefined && typedPoint.lng !== undefined) {
            globeRef.current.pointOfView(
                { lat: typedPoint.lat, lng: typedPoint.lng, altitude: 1.1 },
                800
            );
        }
    };

    // Determine point color based on selection state
    const getPointColor = (point: any): string => {
        const typedPoint = point as LocationData;
        return typedPoint.color || "#ffffaa";
    };

    return (
        <Box className={`${classes.root} ${className || ""}`}>
            <Globe
                ref={globeRef}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                atmosphereAltitude={config.atmosphere_altitude}
                showAtmosphere={true}
                showGraticules={false}
                animateIn={true}
                pointsData={pointsData as any}
                pointLat={(point: any) => (point as LocationData).lat}
                pointLng={(point: any) => (point as LocationData).lng}
                pointLabel={(point: any) => (point as LocationData).city_name}
                pointColor={getPointColor}
                pointAltitude={0}
                pointRadius={0.25}
                pointResolution={36}
                labelText={(point: any) => (point as LocationData).city_name}
                labelSize={1.5}
                labelDotRadius={0.8}
                labelColor={() => "#ffffff"}
                labelResolution={2}
                labelIncludeDot={true}
                onPointClick={handlePointClick}
                onPointHover={(point: any) => {
                    // Optional: add visual feedback on hover
                    if (globeRef.current) {
                        globeRef.current.pointOfView();
                    }
                }}
                arcsData={arcsData}
                arcStartLat={(arc: any) => arc.startLat}
                arcStartLng={(arc: any) => arc.startLng}
                arcEndLat={(arc: any) => arc.endLat}
                arcEndLng={(arc: any) => arc.endLng}
                arcColor={(arc: any) => getArcColor(arc)}
                arcAltitude={(arc: any) => getArcAltitude(arc)}
                arcStroke={0.1}
                enablePointerInteraction={true}
                showPointerCursor={true}
            />
        </Box>
    );
};

export default GlobeComponent;

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: "100%",
        maxWidth: "100%",
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
        [theme.breakpoints.down("md")]: {
            height: "70vh",
        },
        [theme.breakpoints.down("sm")]: {
            height: "80vh",
        },
    },
}));
