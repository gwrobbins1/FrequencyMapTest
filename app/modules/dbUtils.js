'use strict';
var mysql = require("mysql");
var dbUtils = (function(){
	var configuration = null;
	// var connection = null;
	var pool = null;

	var init = function(config){
		configuration = config;
		pool = mysql.createPool({
			multipleStatements : true,
			connectionLimit:100,
			host:configuration.mySqlHost,
			user:configuration.user,
			password:configuration.password,
			database:configuration.database
		});	
		console.log("Intialized DB connection");
	};

	var connect = function(){
		// connection = mysql.createConnection({
		// 	multipleStatements : true,
		// 	host:configuration.mySqlHost,
		// 	user:configuration.user,
		// 	password:configuration.password,
		// 	database:configuration.database
		// });	

		// connection.connect();

		console.log("DB connection opened");
		pool.getConnection(function(err,connection){
			if(err){console.log(err);}
			else{
				return connection;
			}
		});
	};

	var insertSensors = function(sensorArray){
		var connection = connect();
		if(connection !== undefined){
			connection.query(
				{
					sql:"INSERT INTO sensors (SID,Latitude,Longitude) VALUES ?;",
					values:[sensorArray]
				},
				function(err,results,fields){					
					if(err){console.log(err);}
					else{console.log("Inserted "+results.affectedRows+" sensors into DB.");}
					close(connection);
				}
			);			
		}
	};

	var insertSensor = function(sensor){
		var connection = connect();
		if(connection !== undefined){
			connection.query(
				{
					sql:"INSERT INTO sensors SET ?;",
					values:sensor
				},
				function(err,results,fields){					
					if(err){console.log(err);}
					else{console.log("inserted new sensor id:"+sensor.SID);}
					close(connection);
				}
			);			
		}		
	};

	var insertLiveReadings = function(sensorData){
		var sqlQuery = "DELETE FROM live;"+
			"INSERT INTO live (Sensors_SID,TIME,Frequency,Readings,Completed) VALUES ?;";
		var connection = connect();
		if(connection !== undefined){
			connection.query(
				{
					sql:sqlQuery,
					values:[sensorData]
				},
				function(err,results,fields){
					if(err){console.log(err);}
					else{console.log("Inserted live readings");}
					close(connection);
				}
			);			
		}		
	};

	var insertHistoricalReadings = function(sensorData){
		var connection = connect();
		if(connection !== undefined){
			connection.query(
				{
					sql:"INSERT INTO recorded_data (Sensors_SID,TIME,Frequency,Readings,Completed) VALUES ?;",
					values:[sensorData]
				},
				function(err,results,fields){
					if(err){console.log(err);}
					else{console.log("Number of readings recorded for historical readings: "+results.affectedRows);}
					close(connection);
				}
			);
		}
	};

	var close = function(connection){
		connection.release();
		console.log("DB connection released");
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