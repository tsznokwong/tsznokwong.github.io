import React, { useState, useMemo } from "react";
import { Theme, Container, Box } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';

import ParagraphSection from "../../components/paragraph-section";
import Globe from "../../components/globe";
import LocationCard from "../../components/location-card";
import Data from "../../assets/data/travel-page.json";
import { TravelPageData, LocationData } from "../../types/location-type";

type TravelPageProps = {};

const TravelPage = (props: TravelPageProps) => {
    const classes = useStyles();
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

    return (
        <Container className={classes.root} maxWidth={false} disableGutters>
            <ParagraphSection
                className={classes.introContainer}
                title={(Data as TravelPageData).title}
                subtitle={(Data as TravelPageData).subtitle}
            />
            <Box className={classes.globeContainerWrapper}>
                <Globe
                    locations={locations}
                    selectedLocationId={selectedLocationId}
                    onLocationSelect={setSelectedLocationId}
                    config={(Data as TravelPageData).globe_config}
                    arcs={arcs}
                />
                <Box className={classes.cardContainer}>
                    <LocationCard location={selectedLocation} />
                </Box>
            </Box>
        </Container>
    );
};

export default TravelPage;

const useStyles = makeStyles((theme: Theme) => {
    return {
        root: {
            width: "100%",
            maxWidth: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "0 !important",
            margin: "0 !important",
            boxSizing: "border-box",
            overflow: "hidden",
        },
        introContainer: {
            marginTop: "0",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPositionX: "75%",
        },
        globeContainerWrapper: {
            width: "100%",
            maxWidth: "100%",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxSizing: "border-box",
            height: "80vh",
            [theme.breakpoints.down("md")]: {
                height: "70vh",
            },
            [theme.breakpoints.down("sm")]: {
                height: "80vh",
            },
        },
        cardContainer: {
            position: "absolute",
            bottom: "1rem",
            left: "50%",
            transform: "translateX(-50%)",
            width: "calc(100% - 2rem)",
            maxWidth: "600px",
            maxHeight: "60%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            boxSizing: "border-box",
            zIndex: 10,
            pointerEvents: "auto",
            overflowY: "auto",
            [theme.breakpoints.down("sm")]: {
                bottom: "0.5rem",
                width: "calc(100% - 1rem)",
                maxHeight: "60%",
            },
        },
    };
});
