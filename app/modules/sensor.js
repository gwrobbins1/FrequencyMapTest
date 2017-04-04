'use strict';
var _ = require('lodash/core');

var sensor = (function(){
	var sensors = [];
	var minFrequency = null;
	var maxFrequency = null;
	var minStrength = null;
	var maxStrength = null;	


	function getTimeStamp(){
		return new Date().toISOString().slice(0,19).replace('T',' ');
	};

	var addSensor = function(sensor){
		sensors.push(sensor);
	};

	var makeSensorReadings = function(insertFunc){//format for mysql db
		if(minFrequency !== null && maxFrequency !== null &&
			minStrength !== null && maxStrength !== null){
			console.log("Strating sensor readings at:"+getTimeStamp());
			var sensorData = {};
			_.map(sensors,function(sensor){
				sensorData['SID'] = sensor.SID;
				for(var freq = minFrequency; freq <= maxFrequency;freq++){
					sensorData['TIME'] = getTimeStamp();
					sensorData['Frequency'] = freq;
					sensorData['Readings'] = minStrength + (maxStrength-minStrength)*Math.random();
					sensorData['Completed'] = 1;
					insertFunc(sensorData);
				}				
			});
			console.log("Sensor readings finished at:"+getTimeStamp());
		}
	};

	var setSensorFrequency = function(range){
		if(Array.isArray(range) && range.length > 0){
			minFrequency = range[0];
			maxFrequency = range[1];
		}
	};

	var setSensorStrength = function(range){
		if(Array.isArray(range) && range.length > 0){
			minStrength = range[0];
			maxStrength = range[1];
		}
	};

	var getSensorLocation = function(sensorId){
		var Break = {};
		var location = [];
		try{
			sensors.forEach(function(sensor){
				if(sensor.SID === sensorId){
					console.log("lat: "+sensor.Latitude);
					console.log("lon: "+sensor.Longitude);
					location.push(sensor.Longitude);
					location.push(sensor.Latitude);
					throw new Break;
				}
			});
		}catch(ignore){}

		return location;
	};
	
	var getLiveSensorReadings = function(){
		var sensorData = [];	
		_.map(sensors,function(sensor){//format for webserver and pick random strength
			var newSensor = {};	
			// newSensor['sensorId'] = sensor.SID;
			newSensor['id'] = sensor.SID;
			newSensor['location'] = [sensor.Longitude,sensor.Latitude];
			newSensor['timeStamp'] = getTimeStamp();
			newSensor['name'] = "TestSensor-"+sensor.SID;
			newSensor['readings'] = {};
			for(var freq = minFrequency; freq <= maxFrequency;freq++){				
				newSensor.readings[freq] = minStrength + (maxStrength-minStrength)*Math.random();
			}			
			sensorData.push(newSensor);
		});
		return sensorData;
	};

	return {
		addSensor : addSensor,
		setSensorFrequency : setSensorFrequency,
		setSensorStrength : setSensorStrength,
		makeSensorReadings : makeSensorReadings,
		getLiveSensorReadings : getLiveSensorReadings,
		getSensorLocation : getSensorLocation
	};
})();


module.exports = sensor;