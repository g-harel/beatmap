import React from "react";

import {Map, GoogleApiWrapper, Marker, ProvidedProps} from "google-maps-react";

const styles = require("./GoogleMapStyles.json");

interface State {
    lng: number;
    lat: number;
}

export class MapContainer extends React.Component<ProvidedProps, State> {
    state = {
        lng: 0,
        lat: 0,
    };

    async loadData() {
        await fetch("http://localhost:5000/plays", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                start_date: "1999-02-01T21:00:02Z",
                end_date: "1999-02-01T22:00:02Z",
                coordinates: [this.state],
            }),
        })
            .then((response) => response.json())
            .then((jsonResponse) => console.log(jsonResponse));
        //TODO resolve promise with awaits/async, not sure
    }

    render() {
        return (
            <Map
                google={this.props.google}
                zoom={4.5}
                styles={styles}
                mapTypeControl={false}
                streetViewControl={false}
                panControl={false}
                zoomControl={false}
                rotateControl={false}
                fullscreenControl={false}
                initialCenter={{
                    lat: 41.850033,
                    lng: -87.6500523,
                }}
                onClick={(_mapProps, _map, event) => {
                    this.setState({
                        lng: event.pa.x,
                        lat: event.pa.y,
                    });
                    this.loadData();
                }}
            >
                <Marker position={this.state} />
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyDxkhcAv0IkrfSsjUy3M3ctNgfPqKCUd8w",
})(MapContainer);
