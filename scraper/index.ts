import got from "got";

const hostname = "conuhacks-playback-api.touchtunes.com";
const path = "/plays";
const secret = "9923ac9b-8fd3-421f-b0e5-952f807c6885";
const limit = 5000;
const parallel = 64;
const gap = 12 * 60 * 60 * 1000;

interface Play {
    playDate: string;
    artistId: number;
    songId: number;
    state: string;
    style: string;
    latitude: number;
    longitude: number;
}

interface Response {
    plays: Play[];
    totalRecordsCount: number;
}

// Directly fetch play events by start, end and pagination number.
// Querying over a smaller range will resolve faster.
const fetchData = async (
    start: Date,
    end: Date,
    page: number,
    count: number,
): Promise<Response> => {
    const query: Record<string, string> = {
        startDate: start.toISOString().replace(/\.\d{3}Z$/, "Z"),
        endDate: end.toISOString().replace(/\.\d{3}Z$/, "Z"),
        limit: String(count),
        offset: String(page),
    };

    const qs = Object.keys(query)
        .map((key) => `${key}=${query[key]}`)
        .join("&");

    const headers = {"client-secret": secret};

    const res = await got(`https://${hostname}${path}?${qs}`, {headers});
    return JSON.parse(res.body);
};

// Fetch all play events between start and end dates.
// Each event will be passed to the callback.
const fetchByRange = async (
    start: Date,
    end: Date,
    callback: (play: Play) => any,
): Promise<void> => {
    const delta = end.getTime() - start.getTime();
    const subset = delta / gap;

    for (let i = 0; i < subset; i++) {
        const startI = start.getTime() + i * gap;
        const endI = startI + gap;
        const startD = new Date(startI);
        const endD = new Date(endI);

        // Fetch initial page to efficiently query paged data.
        const resInitial = await fetchData(startD, endD, 0, limit);
        resInitial.plays.forEach(callback);

        // Fetch paged data in parallel.
        const remaining = resInitial.totalRecordsCount - resInitial.plays.length;
        for (let j = 0; j < remaining / (limit * parallel); j++) {
            const responses: Promise<any>[] = [];
            for (let k = 0; k < parallel; k++) {
                const page = j * parallel + k;
                responses.push(
                    fetchData(startD, endD, page, limit).then(({plays}) => {
                        plays.forEach(callback);
                    }),
                );
            }
            await Promise.all(responses);
        }
    }
};

let i = 0;
const main = async () => {
    console.time();
    await fetchByRange(
        new Date("January 1, 2018"),
        new Date("January 2, 2018"),
        (_) => {
            if (1) process.stdout.write(`\rplays ${i++}`);
        },
    );
    console.timeEnd();
};

main();
