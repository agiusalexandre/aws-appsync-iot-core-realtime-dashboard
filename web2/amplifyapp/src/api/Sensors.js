import { API, graphqlOperation } from 'aws-amplify';
import { resolveNaptr } from 'dns';
import { getSensor, listSensors, getSensorsByCityName } from '../graphql/queries';

export const GetSensorStatusColor = (status) => {
    let r = "";

    if (status === 1) {
        r = "green"
    } else if (status === 2) {
        r = "yellow"
    } else if (status === 3) {
        r = "red"
    } else {
        r = "white"
    }

    return r;
}

export const GetSensor = async (sensorId) => {

    try {

        const response = (await API.graphql(graphqlOperation(getSensor, { sensorId: sensorId })));

        if (response.data.getSensor) {

            const r = response.data.getSensor;

            return r;
        }
        else {

            return null;
        }

    } catch (error) {
        throw error;
    }
}

export const GetSensors = async () => {

    try {

        const response = (await API.graphql(graphqlOperation(listSensors)));

        if (response.data && response.data.listSensors) {

            const r = response.data.listSensors;

            return r;
        }
        else {

            return Array();
        }

    } catch (error) {
        throw error;
    }
}

export const GetSensorsByCityName = async (cityName) => {

    try {

        const response = (await API.graphql(graphqlOperation(getSensorsByCityName, { cityName: cityName })));

        console.log("test3")
        console.log(response)
        if (response.data.getSensorsByCityName) {

            const r = response.data.getSensorsByCityName;

            return r;
        }
        else {

            return null;
        }

    } catch (error) {
        console.log(error)
        throw error;
    }
}


