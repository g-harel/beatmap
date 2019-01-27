import React from "react";

import {Marker, MarkerProps} from "google-maps-react";

export interface Props extends MarkerProps {
    id: string;
}

const CustomMarker: React.StatelessComponent<Props> = (props) => {
    const {id} = props;

    const onClick: MarkerProps["onClick"] = (_) => {
        console.log(id);
    };

    return <Marker onClick={onClick} {...props} />;
};

export default CustomMarker;
