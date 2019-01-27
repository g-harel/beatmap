const component = document.getElementById("sidebar");
if (!component) throw "Could find sidebar";

interface MapData {
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

interface ApiData {
    artistId: number;
    artistName: string;
    count: number;
    songId: number;
    songTitle: string;
    style: string;
}

const fetchData = async (data: MapData): Promise<ApiData[]> => {
    const coordinates: [number, number][][] = [];

    data.features.forEach((feature) => {
        coordinates.push(feature.geometry.coordinates[0]);
    });
    console.log("req", coordinates);

    const res = await fetch("http://localhost:5000/plays/top", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({coordinates}),
    }).then((response) => response.json());

    if (res.error) throw res.error;

    console.log("res", res);
    return res;
};

export const updateSidebar = async (data: MapData | null): Promise<any> => {
    if (data === null) {
        return (component.innerHTML = `
            <div class="loading"></div>
        `);
    }

    const plays = await fetchData(data);
    let html = "";
    plays.forEach((play) => {
        html += `
            <div class="item">
                <div class="song">${play.songTitle}</div>
                <div class="artist">${play.artistName}</div>
            </div>
        `;
    });
    component.innerHTML = html;
};

updateSidebar(null);
