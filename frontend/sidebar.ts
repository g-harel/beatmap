import {fetchData, stripes} from "./utils";
import {MapData} from "./types";

const component = document.getElementById("sidebar");
if (!component) throw "Could find sidebar";

export const updateSidebar = async (coordinates: MapData | null): Promise<any> => {
    const background = stripes({color: "#2a2a2a"});
    component.innerHTML = `<div class="waiting" style="${background}"></div>`;
    if (!coordinates) return;

    const {data} = await fetchData(coordinates);
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
};

updateSidebar(null);
