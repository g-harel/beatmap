import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';

const styles = require('./styles/GoogleMapStyles.json')

export class MapContainer extends Component {
  render() {
    return (
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
      />
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDxkhcAv0IkrfSsjUy3M3ctNgfPqKCUd8w'
})(MapContainer);
