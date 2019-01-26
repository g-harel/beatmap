import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker} from 'google-maps-react';

const styles = require('./styles/GoogleMapStyles.json')

export class MapContainer extends Component {

  addMarker = (location, map) => {
    console.log(location);
  }

  render() {
    return (
      <body>
        <h1>ConUHack</h1>
        <p>Gab, Phil & Feken</p>
        <Map
          google={this.props.google}
          zoom={4}
          styles={styles}
          mapTypeControl={false}
          streetViewControl={false}
          panControl={false}
          zoomControl={false}
          rotateControl={false}
          fullscreenControl={false}
          initialCenter={{
            lat: 41.850033,
            lng: -87.6500523
          }}
          onClick={(t, map, c) => this.addMarker(c.latLng, map)}
        >
        <Marker lat={41.850033} lng={-87.6500523} />  
        </Map>
      </body>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDxkhcAv0IkrfSsjUy3M3ctNgfPqKCUd8w'
})(MapContainer);
