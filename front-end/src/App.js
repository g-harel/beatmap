import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker} from 'google-maps-react';

const styles = require('./styles/GoogleMapStyles.json')

export class MapContainer extends Component {

  constructor(props) {
    super(props); 
    this.state = {
       lat: '',
       lng: ''
    }
 }

 addMarker = async (location, map) => {
    var latlng = String(location).replace(/[{()}]/g, '');
    var split = latlng.split(',');

    var lat = split[0];
    var lng = split[1];

    this.setState({
      lat: lat,
      lng: lng
    });

    await fetch('http://localhost:5000/plays', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "start_date": "1999-02-01T21:00:02Z",
        "end_date": "1999-02-01T22:00:02Z",
        "coordinates": [{
          "long": lng,
          "lat": lat
        }]
      })
    }).then(response => response.json())
    .then(jsonResponse => console.log(jsonResponse))
    //TODO resolve promise with awaits/async, not sure

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
        <Marker
          position={{ lat: this.state.lat, lng: this.state.lng}}
          name={'Music around here'}
        />  
        </Map>
      </body>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDxkhcAv0IkrfSsjUy3M3ctNgfPqKCUd8w'
})(MapContainer);
