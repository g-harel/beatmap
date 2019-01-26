import React from 'react';
import {Marker} from 'google-maps-react';

const CustomMarker = (props) => {
    const {id} = props;

    const onMarkerclick = (evt) => {
        console.log(id);
    };

    return (
        <Marker
        onClick={onMarkerclick}
        {...props}
        />
    );
};

export default CustomMarker;