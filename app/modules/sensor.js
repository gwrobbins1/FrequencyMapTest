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

	var getSensors = function(){
		return sensors;
	}

	var makeSensorReadings = function(insertFunc){//format for mysql db
		if(minFrequency !== null && maxFrequency !== null &&
			minStrength !== null && maxStrength !== null){
			console.log("Starting sensor readings at:"+getTimeStamp());
			_.map(sensors,function(sensor){
				for(var freq = minFrequency; freq <= maxFrequency;freq++){
					var sensorData = [];
					sensorData.push(sensor.SID);
					sensorData.push(getTimeStamp());
					sensorData.push(freq);
					sensorData.push(minStrength + (maxStrength-minStrength)*Math.random());
					sensorData.push(1);
					insertFunc(sensorData);
				}
			});			
			console.log("Sensor readings finished at:"+getTimeStamp());
		}
	};

	// var makeSensorReadings = function(insertFunc){//format for mysql db
	// 	if(minFrequency !== null && maxFrequency !== null &&
	// 		minStrength !== null && maxStrength !== null){
	// 		console.log("Starting sensor readings at:"+getTimeStamp());
	// 		var sensorDataArray = [];
	// 		_.map(sensors,function(sensor){
	// 			for(var freq = minFrequency; freq <= maxFrequency;freq++){
	// 				var sensorData = [];
	// 				sensorData.push(sensor.SID);
	// 				sensorData.push(getTimeStamp());
	// 				sensorData.push(freq);
	// 				sensorData.push(minStrength + (maxStrength-minStrength)*Math.random());
	// 				sensorData.push(1);
	// 				sensorDataArray.push(sensorData);					
	// 			}				
	// 		});
	// 		insertFunc(sensorDataArray);
	// 		console.log("Sensor readings finished at:"+getTimeStamp());
	// 	}
	// };

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

	return {
		addSensor : addSensor,
		getSensors : getSensors,
		setSensorFrequency : setSensorFrequency,
		setSensorStrength : setSensorStrength,
		makeSensorReadings : makeSensorReadings,
		getSensorLocation : getSensorLocation
	};
})();


module.exports = sensor;