export interface Play {
    playDate: string;
    artistId: number;
    songId: number;
    state: string;
    style: string;
    latitude: number;
    longitude: number;
}

export interface Response {
    plays: Play[];
    totalRecordsCount: number;
}
