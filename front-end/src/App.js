import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker} from 'google-maps-react';

const styles = require('./styles/GoogleMapStyles.json')

export class MapContainer extends Component {

  constructor(props) {
    super(props); 
    this.state = {
       lat: '41.850033',
       lng: '-87.6500523'
    }
 }

  addMarker = (location, map) => {
    var latlng = String(location).replace(/[{()}]/g, '');
    var split = latlng.split(',');

    var lat = split[0];
    var lng = split[1];

    this.setState({
      lat: lat,
      lng: lng
    });

    console.log(lat + "-" + lng);
  }

  render() {
    return (
      <body>
        <h1>ConUHack</h1>
        <p>Gab, Phil & Feken</p>
        <p>lat: {this.state.lat} - lng:{this.state.lng}</p>
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
            lng: -87.6500523
          }}
          onClick={(t, map, c) => this.addMarker(c.latLng, map)}
        > 
        </Map>
      </body>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDxkhcAv0IkrfSsjUy3M3ctNgfPqKCUd8w'
})(MapContainer);
