import React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css'
import { Marker } from 'react-map-gl';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';

interface IProps {
    id: string,
    latitude: number,
    longitude: number,
    color: string,
    onSensorClick: (id: string) => void
}

const SensorMarker: React.FC<IProps> = (props) => {

    return (

        <Marker
            key={props.id}
            longitude={props.longitude}
            latitude={props.latitude}
        >
            <LocalShippingIcon 
                fontSize="small" 
                style={{ color: props.color }}
                onClick={()=>props.onSensorClick(props.id)} 
            />
        
        </Marker>

    );
}

export default SensorMarker;
