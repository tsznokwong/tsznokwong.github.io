import React from "react";
import { Theme, Card, CardContent, Box, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { LocationData } from "../../types/location-type";

interface LocationCardProps {
    location: LocationData | null;
    className?: string;
}

const LocationCard = (props: LocationCardProps) => {
    const { location, className } = props;
    const classes = useStyles();

    if (!location) {
        return (
            <Box className={`${classes.root} ${className || ""}`}>
                <Typography variant="body2" align="center" sx={{ color: "#ffffff" }}>
                    Click on a location to learn more
                </Typography>
            </Box>
        );
    }

    return (
        <Box className={`${classes.root} ${className || ""}`}>
            <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                    {/* Color indicator */}
                    <Box
                        className={classes.colorIndicator}
                        sx={{ backgroundColor: location.color }}
                    />

                    {/* City name */}
                    <Typography variant="h5" component="h2" className={classes.cityName}>
                        {location.city_name}
                    </Typography>

                    {/* Description */}
                    <Typography variant="body1" className={classes.description}>
                        {location.description}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default LocationCard;

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: "100%",
        padding: "2rem 0",
        animation: "$fadeIn 0.3s ease-in-out",
    },
    "@keyframes fadeIn": {
        from: {
            opacity: 0,
            transform: "translateY(10px)",
        },
        to: {
            opacity: 1,
            transform: "translateY(0)",
        },
    },
    card: {
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        borderRadius: "8px",
    },
    cardContent: {
        position: "relative",
        paddingLeft: "20px",
        backgroundColor: "#ffffff",
        padding: "24px",
    },
    colorIndicator: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: "6px",
        borderRadius: "12px 0 0 12px",
    },
    cityName: {
        fontWeight: 600,
        marginBottom: "0.5rem",
        color: theme.palette.text.primary,
    },
    dates: {
        marginBottom: "1rem",
        fontSize: "0.9rem",
        fontWeight: 500,
    },
    description: {
        lineHeight: 1.6,
        color: theme.palette.text.secondary,
    },
}));
