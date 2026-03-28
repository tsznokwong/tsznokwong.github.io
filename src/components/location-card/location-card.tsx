import React from "react";
import { Theme, Card, CardContent, Box, Typography, useTheme } from "@mui/material";
import { LocationData } from "../../types/location-type";

interface LocationCardProps {
    location: LocationData | null;
    className?: string;
}

const LocationCard = (props: LocationCardProps) => {
    const { location, className } = props;
    const theme = useTheme();

    const rootSx = {
        width: "100%",
        padding: "2rem 0",
        animation: "fadeIn 0.3s ease-in-out",
        "@keyframes fadeIn": {
            "0%": {
                opacity: 0,
                transform: "translateY(10px)",
            },
            "100%": {
                opacity: 1,
                transform: "translateY(0)",
            },
        },
    };

    const cardSx = {
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        borderRadius: "8px",
    };

    const cardContentSx = {
        position: "relative",
        paddingLeft: "20px",
        backgroundColor: "#ffffff",
        padding: "24px",
    };

    const colorIndicatorSx = {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: "6px",
        borderRadius: "12px 0 0 12px",
    };

    const cityNameSx = {
        fontWeight: 600,
        marginBottom: "0.5rem",
        color: theme.palette.text.primary,
    };

    const descriptionSx = {
        lineHeight: 1.6,
        color: theme.palette.text.secondary,
    };

    if (!location) {
        return (
            <Box sx={rootSx} className={className}>
                <Typography variant="body2" align="center" sx={{ color: "#ffffff" }}>
                    Click on a location to learn more
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={rootSx} className={className}>
            <Card sx={cardSx}>
                <CardContent sx={cardContentSx}>
                    {/* Color indicator */}
                    <Box
                        sx={{ ...colorIndicatorSx, backgroundColor: location.color }}
                    />

                    {/* City name */}
                    <Typography variant="h5" component="h2" sx={cityNameSx}>
                        {location.city_name}
                    </Typography>

                    {/* Description */}
                    <Typography variant="body1" sx={descriptionSx}>
                        {location.description}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default LocationCard;
