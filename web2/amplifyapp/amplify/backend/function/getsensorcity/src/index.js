const AWS = require('aws-sdk');
const iotClient = new AWS.Iot();

var region = process.env.REGION;

AWS.config.update({
    region: region
});

exports.handler = async (event) => {
    
    const cityName = event.arguments.cityName || "";
    
var resultArray = [];

    try {

        var params = {
            queryString: 'shadow.reported.city:'+cityName,
            maxResults: 500
        };

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
        throw new Error("Error retrieving sensor: " + cityName);
    }
};
