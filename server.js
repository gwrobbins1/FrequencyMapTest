'use strict'

var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var fs = require('fs');
var sensorModule = require("./app/modules/sensor");
var dbUtils = require("./app/modules/dbUtils");
var api = require("./app/routes/api")(app,express,sensorModule);

app.use(bodyParser.urlencoded({ extended: true }));
app.use( bodyParser.json() );
app.use(morgan("dev"));

app.use("/",api);

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
	dbUtils.configure(config);
	dbUtils.connect();
	var sensor = {};

	for(var i = 1; i <= config.numOfSensors;i++){
		sensor = {
			SID:i,
			Latitude:config.minLat + (config.maxLat-config.minLat)*Math.random(),
			Longitude:config.minLon + (config.maxLon-config.minLon)*Math.random()
		};
		sensorModule.addSensor(sensor);//cached for readings
		dbUtils.insert(sensor);
	}
	dbUtils.close();

	setInterval(function(){
			dbUtils.connect();
			sensorModule.makeSensorReadings(dbUtils.insertSensorReadings);
			dbUtils.close();
		},3e5); //5 min interval

	// setInterval(function(){
	// 		dbUtils.connect();
	// 		sensorModule.makeSensorReadings(dbUtils.insertSensorReadings);
	// 		dbUtils.close();
	// 	},60e3);//1 min interval

	app.use("/",express.static(path.join(__dirname,"/public")) );	
	app.listen( 7000 );
	console.log("server started on port: "+7000);	
});