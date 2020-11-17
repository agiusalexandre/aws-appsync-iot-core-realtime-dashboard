/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateSensorValue = /* GraphQL */ `
  subscription OnCreateSensorValue($sensorId: String!) {
    onCreateSensorValue(sensorId: $sensorId) {
      id
      sensorId
      temperature
      pressure
      latitude
      longitude
      status
      timestamp
      createdAt
      updatedAt
    }
  }
`;
export const onCreateSensorValues = /* GraphQL */ `
  subscription OnCreateSensorValues {
    onCreateSensorValues {
      id
      sensorId
      temperature
      pressure
      latitude
      longitude
      status
      timestamp
      createdAt
      updatedAt
    }
  }
`;
