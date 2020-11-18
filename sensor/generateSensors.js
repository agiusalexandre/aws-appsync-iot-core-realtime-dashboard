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
                "frequency": 10000,
                "sensors": 100,
                "geo": {
                    "latitude": 48.864716,
                    "longitude": 2.349014,
                    "radius": 500
                },
                "clientId": "sensor-fr-par"
            },
            {
                "name": "Lyon - France",
                "frequency": 10000,
                "sensors": 100,
                "geo": {
                    "latitude": 45.76342,
                    "longitude": 4.834277,
                    "radius": 500
                },
                "clientId": "sensor-fr-lyo"
            },
            {
                "name": "Marseille - France",
                "frequency": 10000,
                "sensors": 100,
                "geo": {
                    "latitude": 43.296398,
                    "longitude": 5.37,
                    "radius": 500
                },
                "clientId": "sensor-fr-mrs"
            }]
        },
        {
            "name": "UK",
            "cities": [{
                "name": "Londres - England",
                "frequency": 10000,
                "sensors": 100,
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
                    "thingTypeName": SENSOR_THING_TYPE_NAME,
                    "manufacturer": SENSOR_MANUFACTURER,
                    "model": SENSOR_MODEL,
                    "firmware": SENSOR_FIRMWARE,
                    "frequency": 5000,
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