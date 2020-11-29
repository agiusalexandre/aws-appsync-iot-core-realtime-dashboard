const fs = require('fs');


const SENSORS_FILE = './sensors.json';
const SENSOR_THING_TYPE_NAME = 'TEMPERATURE_SENSOR';
const SENSOR_MANUFACTURER = 'STmicroelectronics';
const SENSOR_MODEL = 'WQ201';
const SENSOR_FIRMWARE = '1.12'

const sensors = [
    {
        "countries": [{
            "name": "France",
            "cities": [{
                "name": "Paris - France",
                "city": "Paris",
                "frequency": 1000,
                "sensors": 10,
                "geo": {
                    "latitude": 48.864716,
                    "longitude": 2.349014,
                    "radius": 500
                },
                "clientId": "sensor-fr-par"
            },
            {
                "name": "Lyon - France",
                "city": "Lyon",
                "frequency": 1000,
                "sensors": 10,
                "geo": {
                    "latitude": 45.76342,
                    "longitude": 4.834277,
                    "radius": 500
                },
                "clientId": "sensor-fr-lyo"
            },
            {
                "name": "Nantes - France",
                "city": "Nantes",
                "frequency": 60000,
                "sensors": 10,
                "geo": {
                    "latitude": 47.2382007,
                    "longitude": -1.6300958,
                    "radius": 500
                },
                "clientId": "sensor-fr-nan"
            },
            {
                "name": "Lille - France",
                "city": "Lille",
                "frequency": 60000,
                "sensors": 10,
                "geo": {
                    "latitude": 50.6310465,
                    "longitude": 2.9771209,
                    "radius": 500
                },
                "clientId": "sensor-fr-lil"
            },
            {
                "name": "Toulouse - France",
                "city": "Toulouse",
                "frequency": 60000,
                "sensors": 10,
                "geo": {
                    "latitude": 43.6006785,
                    "longitude": 1.3626298,
                    "radius": 500
                },
                "clientId": "sensor-fr-tou"
            }
        ]
        },
        {
            "name": "UK",
            "cities": [{
                "name": "Londres - England",
                "city": "Londres",
                "frequency": 60000,
                "sensors": 10,
                "geo": {
                    "latitude": 51.5253176,
                    "longitude": -0.1588742,
                    "radius": 500
                },
                "clientId": "sensor-uk-lon"
            }]
        }
        ]
    }
];

var myObject = [];

for (var i = 0; i < sensors.length; i++) {
    var countryList = sensors[i];
    for (var y = 0; y < countryList.countries.length; y++) {
        var cityList = countryList.countries[y];
        for (var z = 0; z < cityList.cities.length; z++) {
            var city = cityList.cities[z];
            var length = city.sensors;
            for (var b = 0; b < length; b++) {
                myObject.push({
                    "name": city.name + "_" + b,
                    "city": city,
                    "thingTypeName": SENSOR_THING_TYPE_NAME,
                    "manufacturer": SENSOR_MANUFACTURER,
                    "model": SENSOR_MODEL,
                    "firmware": SENSOR_FIRMWARE,
                    "frequency": city.frequency,
                    "geo": {
                        "latitude": city.geo.latitude,
                        "longitude": city.geo.longitude,
                        "radius": city.geo.radius
                    },
                    "settings": {
                        "host": "",
                        "keyPath": "",
                        "certPath": "",
                        "caPath": "",
                        "certificateArn": "",
                        "clientId": city.clientId + "_" + b
                    }
                });

            }
        }
    }
}


let data = JSON.stringify(myObject);
fs.writeFileSync(SENSORS_FILE, data);