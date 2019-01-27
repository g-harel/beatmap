import {fetchData, stripes} from "./utils";
import {MapData, ApiData} from "./types";

const component = document.getElementById("sidebar");
if (!component) throw "Could find sidebar";

const drawWaiting = () => {
    const background = stripes({color: "#2a2a2a"});
    component.innerHTML = `<div class="waiting" style="${background}"></div>`;
};

const drawLoading = () => {
    let html = "";
    for (let i = 0; i < 10; i++) {
        html += `
            <div class="item loading">
                <div class="count loading">&nbsp;</div>
                <div class="song loading">&nbsp;</div>
                <div class="artist loading">&nbsp;</div>
            </div>
        `;
    }
    component.innerHTML = html;
};

const drawReady = ({data}: ApiData) => {
    let html = "";
    data.forEach((item, i) => {
        html += `
            <div class="item">
                <div class="count">${i}</div>
                <div class="song">${item.songTitle || "&nbsp;"}</div>
                <div class="artist">${(item.artistName || "&nbsp;").toLowerCase()}</div>
            </div>
        `;
    });
    component.innerHTML = html;
}

export const updateSidebar = async (coordinates: MapData | null): Promise<any> => {
    drawWaiting();
    if (!coordinates) return;
    drawLoading();
    drawReady(await fetchData(coordinates));
};

updateSidebar(null);
