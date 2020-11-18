const awsIot = require('aws-iot-device-sdk');

//load the sensors file that contains the location of the device certificates and the clientId of the sensor
var sensors = require('./sensors-ca.json');

//constants used in the application
const SHADOW_TOPIC = "$aws/things/[thingName]/shadow/update";
const VALUE_TOPIC = "dt/europe/FR/[thingName]/sensor-value"; //topic to which sensor values will be published

//shadow document to be transmitted at statup
var shadowDocument = {
    state: {
        reported: {
            name: "",
            enabled: true,
            geo: {
                latitude: 0,
                longitude: 0
            }
        }
    }
}

async function run(sensor) {

    //initialize the IOT device
    var device = awsIot.device(sensor.settings);

    //create a placeholder for the message
    var msg = {
        temperature: 0,
        pressure: 0,
        timestamp: new Date().getTime()
    }

    device.on('connect', function () {

        console.log('connected to IoT Hub');

        //publish the shadow document for the sensor
        var topic = SHADOW_TOPIC.replace('[thingName]', sensor.settings.clientId);

        shadowDocument.state.reported.name = sensor.name;
        shadowDocument.state.reported.enabled = true;
        shadowDocument.state.reported.geo.latitude = sensor.geo.latitude;
        shadowDocument.state.reported.geo.longitude = sensor.geo.longitude;

        device.publish(topic, JSON.stringify(shadowDocument));

        console.log('published to shadow topic ' + topic + ' ' + JSON.stringify(shadowDocument));
        var first = true;
        var randomLocation = getRandomLocation(sensor.geo.latitude, sensor.geo.longitude, sensor.geo.radius);
        //publish new value readings based on value_rate
        setInterval(function () {
            if (!first) {
                randomLocation = getRandomLocation(randomLocation.latitude, randomLocation.longitude, sensor.geo.radius);
            }
            first = false;
            //calculate randome values for each sensor reading
            msg.temperature = RandomValue(50, 110) / 10;
            msg.pressure = RandomValue(200, 350) / 10;
            msg.latitude = randomLocation.latitude;
            msg.longitude = randomLocation.longitude;
            msg.timestamp = new Date().getTime();


            //publish the sensor reading message
            var topic = VALUE_TOPIC.replace('[thingName]', sensor.settings.clientId);

            device.publish(topic, JSON.stringify(msg));

            console.log('published to telemetry topic ' + topic + ' ' + JSON.stringify(msg));

        }, sensor.frequency);
    });

    device.on('error', function (error) {
        console.log('Error: ', error);
    });
}

function RandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


var getRandomLocation = function getRandomLocation(latitude, longitude, radiusInMeters) {

    var r = radiusInMeters / 111300 // = 100 meters
        , y0 = latitude
        , x0 = longitude
        , u = Math.random()
        , v = Math.random()
        , w = r * Math.sqrt(u)
        , t = 2 * Math.PI * v
        , x = w * Math.cos(t)
        , y1 = w * Math.sin(t)
        , x1 = x / Math.cos(y0)

    return {
        latitude: y0 + y1,
        longitude: x0 + x1
    }
};

//run simulation for each sensor
sensors.forEach((sensor) => {
    run(sensor);
})

