import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';

const styles = require('./styles/GoogleMapStyles.json')

const mapStyles = {
  width: '100%',
  height: '100%'
};

export class MapContainer extends Component {
  render() {
    return (
      <Map
        google={this.props.google}
        zoom={4}
        style={styles}
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
