import React, { useState, useMemo } from "react";
import { Container, Box, useTheme } from "@mui/material";

import ParagraphSection from "../../components/paragraph-section";
import Globe from "../../components/globe";
import LocationCard from "../../components/location-card";
import Data from "../../assets/data/travel-page.json";
import { TravelPageData, LocationData } from "../../types/location-type";

type TravelPageProps = {};

const TravelPage = (props: TravelPageProps) => {
    const theme = useTheme();
    const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

    // Use locations directly from data (coordinates already included)
    const locations = useMemo(() => {
        return (Data as TravelPageData).locations as LocationData[];
    }, []);

    // Get selected location
    const selectedLocation = useMemo(() => {
        return locations.find((loc) => loc.id === selectedLocationId) || null;
    }, [selectedLocationId, locations]);

    // Get arcs from data
    const arcs = useMemo(() => {
        return (Data as TravelPageData).arcs || [];
    }, []);

    const rootSx = {
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column" as const,
        padding: "0 !important",
        margin: "0 !important",
        boxSizing: "border-box" as const,
        overflow: "hidden",
    };

    const introContainerSx = {
        marginTop: "0",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPositionX: "75%",
    };

    const globeContainerWrapperSx = {
        width: "100%",
        maxWidth: "100%",
        position: "relative" as const,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box" as const,
        height: "80vh",
        [theme.breakpoints.down("md")]: {
            height: "70vh",
        },
        [theme.breakpoints.down("sm")]: {
            height: "80vh",
        },
    };

    const cardContainerSx = {
        position: "absolute" as const,
        bottom: "1rem",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 2rem)",
        maxWidth: "600px",
        maxHeight: "60%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        boxSizing: "border-box" as const,
        zIndex: 10,
        pointerEvents: "auto" as const,
        overflowY: "auto" as const,
        [theme.breakpoints.down("sm")]: {
            bottom: "0.5rem",
            width: "calc(100% - 1rem)",
            maxHeight: "60%",
        },
    };

    return (
        <Container sx={rootSx} maxWidth={false} disableGutters>
            <ParagraphSection
                sx={introContainerSx}
                title={(Data as TravelPageData).title}
                subtitle={(Data as TravelPageData).subtitle}
            />
            <Box sx={globeContainerWrapperSx}>
                <Globe
                    locations={locations}
                    selectedLocationId={selectedLocationId}
                    onLocationSelect={setSelectedLocationId}
                    config={(Data as TravelPageData).globe_config}
                    arcs={arcs}
                />
                <Box sx={cardContainerSx}>
                    <LocationCard location={selectedLocation} />
                </Box>
            </Box>
        </Container>
    );
};

export default TravelPage;
