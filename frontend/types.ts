export interface MapData {
    type: string;
    features: {
        id: string;
        type: string;
        properties: {};
        geometry: {
            type: string;
            coordinates: [number, number][][];
        };
    }[];
}

export interface ApiData {
    data: {
        artistId: number;
        artistName: string;
        count: number;
        songId: number;
        songTitle: string;
        style: string;
    }[];
}
