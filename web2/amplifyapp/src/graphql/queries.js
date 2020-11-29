/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const listSensors = /* GraphQL */ `
  query ListSensors {
    listSensors {
      sensorId
      name
      enabled
      geo {
        latitude
        longitude
      }
      status
    }
  }
`;
export const getSensorsByCityName = /* GraphQL */ `
  query GetSensorsByCityName($cityName: String!) {
    getSensorsByCityName(cityName: $cityName) {
      sensorId
      name
      enabled
      geo {
        latitude
        longitude
      }
      status
    }
  }
`;
export const getSensor = /* GraphQL */ `
  query GetSensor($sensorId: String!) {
    getSensor(sensorId: $sensorId) {
      sensorId
      name
      enabled
      geo {
        latitude
        longitude
      }
      status
    }
  }
`;
export const getSensorValue = /* GraphQL */ `
  query GetSensorValue($id: ID!) {
    getSensorValue(id: $id) {
      id
      sensorId
      temperature
      pressure
      latitude
      longitude
      status
      timestamp
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const listSensorValues = /* GraphQL */ `
  query ListSensorValues(
    $filter: ModelSensorValueFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSensorValues(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        sensorId
        temperature
        pressure
        latitude
        longitude
        status
        timestamp
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncSensorValues = /* GraphQL */ `
  query SyncSensorValues(
    $filter: ModelSensorValueFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncSensorValues(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        sensorId
        temperature
        pressure
        latitude
        longitude
        status
        timestamp
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
