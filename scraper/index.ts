import got from "got";

const hostname = "conuhacks-playback-api.touchtunes.com";
const path = "/plays";
const secret = "9923ac9b-8fd3-421f-b0e5-952f807c6885";

const limit = 5000;
const batchSize = 24 * 60 * 60 * 1000;

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
    const batches = delta / batchSize;

    for (let i = 0; i < batches; i++) {
        const startTimestamp = start.getTime() + i * batchSize;
        const startDate = new Date(startTimestamp);
        const endDate = new Date(Math.min(startTimestamp + batchSize, end.getTime()));

        // Fetch initial page to read size of entire dataset.
        const resInitial = await fetchData(startDate, endDate, 0, 1);
        const pageCount = Math.ceil(resInitial.totalRecordsCount / limit);

        const pages = Array(pageCount)
            .fill(null)
            .map((_, page) => {
                return fetchData(startDate, endDate, page, limit).then(({plays}) => {
                    plays.forEach(callback);
                });
            });

        await Promise.all(pages);
    }
};

const main = async () => {
    console.time();
    let i = 0;
    await fetchByRange(
        new Date("December 3, 2018"),
        new Date("December 4, 2018"),
        (_) => i++,
    );
    console.log("total", i);
    console.timeEnd();
};

main();
