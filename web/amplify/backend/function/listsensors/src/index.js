const AWS = require('aws-sdk');
const iotClient = new AWS.Iot();

var region = process.env.REGION;

AWS.config.update({
    region: region
});

exports.handler = async (event) => {

    var resultArray = [];

    //query all sensors that have reported a shadow and of type temperature sensor
    //you must have fleet indexing enabled in IoT Core with REGISTRY_AND_SHADOW indexed
    
            //queryString: 'shadow.reported.name:* AND shadow.reported.geo.latitude: [ ' + latitudeFrom + ' TO ' + latitudeTo + ' ] AND shadow.reported.geo.longitude: [ ' + longitudeFrom + ' TO ' + longitudeTo + ' ] AND thingTypeName:TEMPERATURE_SENSOR',
            

    var params = {
        queryString: 'shadow.reported.name:* AND thingTypeName:TEMPERATURE_SENSOR',
        maxResults: 100
    };

    try {

        var result = await iotClient.searchIndex(params).promise();

        //build an array of the thing shadow values and return array
        result.things.forEach(element => {
            
            var shadow = JSON.parse(element.shadow);

            shadow.reported.sensorId = element.thingName;
            
            resultArray.push(shadow.reported);
        });

        return resultArray;
    }
    catch (err) {

        console.log("error: " + err);

        throw err;
    }
};
