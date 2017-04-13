'use strict'

var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var fs = require('fs');
var sensorModule = require("./app/modules/sensor");
var dbUtils = require("./app/modules/dbUtils");

app.use(bodyParser.urlencoded({ extended: true }));
app.use( bodyParser.json() );
app.use(morgan("dev"));

var config = {};
fs.readFile('./config.properties','utf8',function(err,data){
	if(err){console.log(err);}	
	data.split('\n').forEach(function(line){
		if(line.charAt(0) !== '#'){
			var strArray = line.split(':');
			if(strArray[0] !== '' && strArray[1]){
				// console.log("adding "+strArray[0]+" to config : "+strArray[1]);
				config[strArray[0]] = strArray[1];
			}
		}
	});

	config.numOfSensors = parseInt(config.numOfSensors);
	config.maxLat = parseFloat(config.maxLat);
	config.maxLon = parseFloat(config.maxLon);
	config.minLat = parseFloat(config.minLat);
	config.minLon = parseFloat(config.minLon);
	config.minSensorFrequency = parseInt(config.minSensorFrequency);
	config.maxSensorFrequency = parseInt(config.maxSensorFrequency);
	config.minSensorStrength = parseInt(config.minSensorStrength);
	config.maxSensorStrength = parseInt(config.maxSensorStrength);	
	
	sensorModule.setSensorFrequency([config.minSensorFrequency,config.maxSensorFrequency]);
	sensorModule.setSensorStrength([config.minSensorStrength,config.maxSensorStrength]);
	dbUtils.init(config);

	var sensor = {};//needed to build and store sensor for generating random data. added to sensor module.
	var sensorDataArray = [];//needed to bulk insert sensors into database.
	
	for(var i = 1; i <= config.numOfSensors;i++){
		var sensorData = [];
		sensor = {
			SID:i,
			Latitude:config.minLat + (config.maxLat-config.minLat)*Math.random(),
			Longitude:config.minLon + (config.maxLon-config.minLon)*Math.random()
		};
		sensorModule.addSensor(sensor);//cached for readings
		//format data for bulk insert to DB
		sensorData.push(sensor.SID);
		sensorData.push(sensor.Latitude);
		sensorData.push(sensor.Longitude);
		sensorDataArray.push(sensorData);		
	}
	dbUtils.insertSensors(sensorDataArray);

	dbUtils.clearLiveReadings();	

	setInterval(
		function(){
			sensorModule.makeBatchSensorReadings(dbUtils.updateLiveReadings);
		},
		5e3//5 sec interval
	);	
	
	// setInterval(
	// 	function(){
	// 		sensorModule.makeBatchSensorReadings(dbUtils.insertHistoricalReadings);
	// 	},
	// 	3e5//5 min interval
	// ); 

	// setInterval(
	// 	function(){
	// 		sensorModule.makeSensorReadings(dbUtils.updateLiveReadings);
	// 	},
	// 	5e3//5 sec interval
	// );

	app.use("/",express.static(path.join(__dirname,"/public")) );	
	app.listen( 7000 );
	console.log("server started on port: "+7000);	
});