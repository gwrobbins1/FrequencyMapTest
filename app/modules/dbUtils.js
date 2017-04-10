'use strict';
var mysql = require("mysql");
var dbUtils = (function(){
	var configuration = null;
	var connection = null;

	var init = function(config){
		configuration = config;
		console.log("Intialized DB connection");
	};

	var connect = function(){
		connection = mysql.createConnection({
			multipleStatements : true,
			host:configuration.mySqlHost,
			user:configuration.user,
			password:configuration.password,
			database:configuration.database
		});

		connection.connect();
		console.log("DB connection opened");
	};

	var insertSensors = function(sensorArray){
		if(connection !== null){
			connection.query(
				{
					sql:"INSERT INTO sensors (SID,Latitude,Longitude) VALUES ?;",
					values:[sensorArray]
				},
				function(err,results,fields){
					if(err){console.log(err);}
					else{console.log("Inserted "+results.affectedRows+" sensors into DB.");}
				}
			);
		}
	};

	var insertSensor = function(sensor){
		if(connection !== null){
			connection.query(
				{
					sql:"INSERT INTO sensors SET ?;",
					values:sensor
				},
				function(err,results,fields){
					if(err){console.log(err);}
				}
			);
			console.log("inserted new sensor id:"+sensor.SID);
		}
	};

	var insertLiveReadings = function(sensorData){
		var sqlQuery = "DELETE FROM live;"+
			"INSERT INTO live (Sensors_SID,TIME,Frequency,Readings,Completed) VALUES ?;";
		connect();
		connection.query(
			{
				sql:sqlQuery,
				values:[sensorData]
			},
			function(err,results,fields){
				if(err){console.log(err);}
				else{console.log("Inserted live readings");}
			}
		);
		close();
	};

	var insertHistoricalReadings = function(sensorData){
		if(connection !== null){
			connection.query(
				{
					sql:"INSERT INTO recorded_data (Sensors_SID,TIME,Frequency,Readings,Completed) VALUES ?;",
					values:[sensorData]
				},
				function(err,results,fields){
					if(err){console.log(err);}
					else{console.log("Number of readings recorded for historical readings: "+results.affectedRows);}
				}
			);
		}
	};

	var close = function(){
		if(connection !== null){
			connection.end();
			connection = null;
			console.log("DB connection closed");
		}
	}

	return {
		init : init,
		connect : connect,
		insertSensor : insertSensor,
		insertSensors : insertSensors,
		insertHistoricalReadings : insertHistoricalReadings,
		insertLiveReadings : insertLiveReadings,
		close : close
	};
})();



module.exports = dbUtils;