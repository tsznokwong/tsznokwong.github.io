export type LocationData = {
    id: string;
    city_name: string;
    description: string;
    color: string;
    lat: number;
    lng: number;
};

export type ArcData = {
    startCity: string;
    endCity: string;
    path: "Flight" | "Land" | "Sea";
};

export type GlobeConfig = {
    atmosphere_altitude: number;
    initial_point_of_view: {
        lat: number;
        lng: number;
        altitude: number;
    };
    animation_duration: number;
};

export type TravelPageData = {
    title: string;
    subtitle: string;
    locations: LocationData[];
    arcs?: ArcData[];
    globe_config: GlobeConfig;
};
