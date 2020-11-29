import React, { useState, useEffect, useCallback, useRef } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { useHistory } from 'react-router-dom'
import 'mapbox-gl/dist/mapbox-gl.css';
import SensorMarker from '../../components/SensorMarker/SensorMarker';
import { onCreateSensorValues } from '../../graphql/subscriptions';
import { GetSensorsByCityName, GetSensorStatusColor, GetSensors } from '../../api/Sensors';
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";


import MapGL from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";

import settings from '../../settings.json';

const MapPage = () => {

  const mapRef = useRef();

  const history = useHistory();
  const maxZoom = 1;

  //state variables
  const [viewPort, setViewPort] = useState({
    latitude: 48.864716,
    longitude: 2.349014,
    zoom: maxZoom,
    bearing: 1,
    pitch: 1
  }
  );

  const [sensors, setSensors] = useState([]);
  const [readyToSubscribe, setReadyToSubscribe] = useState(false);


  //fetch initial list of sensors and display current state
  useEffect(() => {

    const initSensors = async () => {

      console.log('fetching sensors');

      try {

        const response = await GetSensors();
        console.log(response);
        if (response) {
          setSensors(response);
          console.log('sensors retrived');
          setReadyToSubscribe(true);
        }
      }
      catch (error) {
        console.log('error fetching sensors', error);
      }
    };

    initSensors()

  }, []);


  //subscribe to changes in sensor values
  useEffect(() => {

    if (readyToSubscribe) {

      console.log('start subscription to sensors');

      const subscriber = API.graphql(graphqlOperation(onCreateSensorValues)).subscribe({
        next: (response) => {

          console.log(response)
          console.log("testtoto")

          //update the sensor's status in state
          if (response.value.data.onCreateSensorValues) {

            var newSensors = [...sensors];

            for (let item of newSensors) {
              console.log(item);
              if (item.sensorId === response.value.data.onCreateSensorValues.sensorId) {
                item.status = response.value.data.onCreateSensorValues.status;
                item.geo.latitude = response.value.data.onCreateSensorValues.latitude;
                item.geo.longitude = response.value.data.onCreateSensorValues.longitude;

                break;
              }
            }

            console.log('sensors updated');

            setSensors(newSensors);
          }
        },
        error: (error) => {
          console.log('error on sensors subscription', error);
        }
      });

      return () => {
        console.log('terminating subscription to sensors');
        subscriber.unsubscribe();
      }
    }

    // eslint-disable-next-line 
  }, [readyToSubscribe]);


  const handleSensorClick = (id) => {
    history.push('/sensor/' + id)
  }

  const updateViewPort = (viewPort) => {

    if (viewPort.zoom >= maxZoom) {
      setViewPort(viewPort);
    }
  }


  const handleresult = useCallback(async (result) => {

    const refreshSensors = async () => {

      try {

        const response = await GetSensorsByCityName(result.result.text);
        console.log("test1")
        console.log(response);
        if (response) {
          setSensors(response);
          console.log('sensors retrieved by city name : ' + result.result.text);
        }
      }
      catch (error) {
        console.log('error fetching sensors by city name', error);
      }
    };

    const subscribeSensors = async () => {
      // subscriber.unsubscribe();

      console.log('start subscription to sensors');

      const subscriber = API.graphql(graphqlOperation(onCreateSensorValues)).subscribe({
        next: (response) => {

          //update the sensor's status in state
          if (response.value.data.onCreateSensorValues) {

            var newSensors = [...sensors];

            for (let item of newSensors) {
              console.log(item);
              if (item.sensorId === response.value.data.onCreateSensorValues.sensorId) {
                item.status = response.value.data.onCreateSensorValues.status;
                item.geo.latitude = response.value.data.onCreateSensorValues.latitude;
                item.geo.longitude = response.value.data.onCreateSensorValues.longitude;

                break;
              }
            }

            console.log('sensors updated');

            setSensors(newSensors);
          }
        },
        error: (error) => {
          console.log('error on sensors subscription', error);
        }
      });

      return () => {
        console.log('terminating subscription to sensors');
        subscriber.unsubscribe();
      }
    };

    await refreshSensors();
    subscribeSensors();

  });


  const handleViewportChange = useCallback(
    (newViewport) => setViewPort(newViewport),
    []
  );

    // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
    const handleGeocoderViewportChange = useCallback(
      (newViewport) => {
        const geocoderDefaultOverrides = { transitionDuration: 1000 };
   
        return handleViewportChange({
          ...newViewport,
          ...geocoderDefaultOverrides
        });
      },
      []
    );

  return (
    <div style={{ height: "100vh" }}>
      <MapGL
        ref={mapRef}
        {...viewPort}
        width="100%"
        height="100%"
        onViewportChange={updateViewPort}
        mapboxApiAccessToken={settings.mapboxApiAccessToken}
      >

        <Geocoder
          mapRef={mapRef}
          onViewportChange={handleGeocoderViewportChange}
          mapboxApiAccessToken={settings.mapboxApiAccessToken}
          position="bottom-left"
          onResult={handleresult}
        />

        {sensors.map((sensor) =>
          (
            <SensorMarker
              key={sensor.sensorId}
              id={sensor.sensorId}
              latitude={sensor.geo.latitude}
              longitude={sensor.geo.longitude}
              color={GetSensorStatusColor(sensor.status)}
              onSensorClick={handleSensorClick}
            />
          )
        )
        }
      </MapGL>
    </div>

  );
}

export default MapPage;
