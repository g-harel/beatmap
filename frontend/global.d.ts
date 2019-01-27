declare class MapboxDraw {
    constructor(options: any);

    getAll(): any;
}

declare namespace mapboxgl {
    let accessToken: string;

    class Map {
        constructor(options: any);

        addControl(options: any): any;
        on(event: string, options: any): any;
    }
}
