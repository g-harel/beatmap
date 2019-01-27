import "./index.css";

import {updateSidebar} from "./sidebar";

mapboxgl.accessToken =
    "pk.eyJ1IjoicGFib21icyIsImEiOiJjanJlbjQzM3gyMWhhNDRwZHQ3Mmo3ZmVpIn0.M-31ijiDTwE4mEOs6v9nlA";

var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/dark-v9",
    center: [-87, 41],
    zoom: 6,
});

var draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
        polygon: true,
        trash: true,
    },
});

map.addControl(draw);
map.on("draw.create", updateArea);
map.on("draw.delete", updateArea);
map.on("draw.update", updateArea);

function updateArea() {
    var data = draw.getAll();
    updateSidebar(data);
}
