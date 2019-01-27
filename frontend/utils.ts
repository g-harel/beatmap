import {MapData, ApiData} from "./types";

export const fetchData = async (data: MapData): Promise<ApiData> => {
    const coordinates: [number, number][][] = [];

    data.features.forEach((feature) => {
        coordinates.push(feature.geometry.coordinates[0]);
    });

    const res = await fetch("http://localhost:5000/plays/top", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({coordinates}),
    }).then((response) => response.json());

    if (res.error) throw res.error;
    return res;
};

// This helper generates background stripes using `background-image`.
// https://www.coffee-break-designs.com/labs/svg_stripe_generator
export const stripes = ({
    color = "#ccc",
    width = 3,
    gap = 6,
    angle = 45,
}: {
    color?: string;
    width?: number;
    gap?: number;
    angle?: number;
} = {}) => {
    const value = width / 2 + gap;
    // prettier-ignore
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
                <pattern id="pattern_stripes" patternUnits="userSpaceOnUse" width="${value}" height="${value}" patternTransform="rotate(${angle})">
                    <line x1="0" y1="0" x2="0" y2="${value}" stroke="${color}" stroke-width="${width * 1.5}" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern_stripes)" opacity="1" />
        </svg>`;
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
    const base64 = btoa(
        encodeURIComponent(svg).replace(/%([0-9A-F]{2})/g, (_, p1) =>
            String.fromCharCode((("0x" + p1) as any) as number),
        ),
    );
    return `background-image: url('data:image/svg+xml;base64,${base64}');`;
};
