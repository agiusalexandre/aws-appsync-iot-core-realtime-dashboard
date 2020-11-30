process.env.AWS_SDK_LOAD_CONFIG = true;

const AWS = require('aws-sdk');
const fs = require('fs').promises;

//if a region is not specified in your local AWS config, it will default to us-east-1
const REGION = AWS.config.region || 'us-east-1';

//if you wish to use a profile other than default, set an AWS_PROFILE environment variable when you run this app
//for example:
//AWS_PROFILE=my-aws-profile node create-sensor.js
const PROFILE = process.env.AWS_PROFILE || 'default';

//constants used in the app - do not change
const SENSORS_FILE = './sensors-ca.json';

//open sensor definition file
var sensors = require(SENSORS_FILE);

//use the credentials from the AWS profile
var credentials = new AWS.SharedIniFileCredentials({ profile: PROFILE });
AWS.config.credentials = credentials;

AWS.config.update({
  region: REGION
});

//Chunk

const SENSORS_CHUNK_SIZE = 10;




async function deleteSensors() {

  try {

    var iot = new AWS.Iot();

    async function chunckDelete(sensors) {



      //iterate over all sensors and create policies, certs, and things
      sensors.forEach(async (sensor) => {

        //remove the iot core endpoint
        sensor.settings.host = "";

        //attach thing to certificate
        await iot.detachThingPrincipal({ thingName: sensor.settings.clientId, principal: sensor.settings.certificateArn }).promise();

        //delete the thing
        await iot.deleteThing({ thingName: sensor.settings.clientId }).promise();

        //detach policy from certificate
        var policyName = 'Policy-' + sensor.settings.clientId;
        await iot.detachPolicy({ policyName: policyName, target: sensor.settings.certificateArn }).promise();

        //delete the IOT policy
        result = await iot.deletePolicy({ policyName: policyName }).promise()

        //delete the certificates
        var certificateId = sensor.settings.certificateArn.split('/')[1];
        result = await iot.updateCertificate({ certificateId: certificateId, newStatus: "INACTIVE" }).promise();
        result = await iot.deleteCertificate({ certificateId: certificateId, forceDelete: true }).promise();
        sensor.settings.certificateArn = ""

        //delete the certificate files
        await fs.unlink(sensor.settings.keyPath);
        sensor.settings.keyPath = "";

        await fs.unlink(sensor.settings.certPath);
        sensor.settings.certPath = "";
        sensor.settings.caPath = "";

        //save the updated settings file
        let data = JSON.stringify(sensors, null, 2);
        await fs.writeFile(SENSORS_FILE, data);
      })

      //display results
      console.log('IoT Things removed: ' + sensors.length);
      console.log('AWS Region: ' + REGION);
      console.log('AWS Profile: ' + PROFILE);

      sensors.forEach((sensor) => {
        console.log('Thing Name: ' + sensor.settings.clientId);
      })
    }

    var sensorChunckedList = chunkArray(sensors, SENSORS_CHUNK_SIZE);

    const delay = (amount = number) => {
      return new Promise((resolve) => {
        setTimeout(resolve, amount);
      });
    }

    async function waitChunckedCreation(sensorChunk) {
      await chunckDelete(sensorChunk);
    };

    (async () => {
      for (const sensorChunk of sensorChunckedList) {
        const contents = await waitChunckedCreation(sensorChunk);
        await delay(4000);
      }

    })();
  } catch (err) {

    console.log('Error deleting sensors');
    console.log(err.message);
  }
}


/**
 * Returns an array with arrays of the given size.
 *
 * @param myArray {Array} array to split
 * @param chunk_size {Integer} Size of every group
 */
function chunkArray(myArray, chunk_size) {
  var index = 0;
  var arrayLength = myArray.length;
  var tempArray = [];

  for (index = 0; index < arrayLength; index += chunk_size) {
    myChunk = myArray.slice(index, index + chunk_size);
    // Do something if you want with the group
    tempArray.push(myChunk);
  }

  return tempArray;
}

deleteSensors();
