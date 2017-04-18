'use strict';
var mysql = require("mysql");
var dbUtils = (function(){
	var configuration = null;
	var pool = null;

	var init = function(config){
		configuration = config;
		pool = mysql.createPool({
			waitForConnections : false,
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
		// console.log("DB connection opened");
		pool.getConnection(function(err,connection){
			if(err){console.log(err);}
			else{
				return connection;
			}
		});
	};

	var insertSensors = function(sensorArray){
		// var connection = connect();
		pool.getConnection(function(err,connection){
			if(err){console.log(err);}
			else{
				if(connection !== undefined){
		     	console.log("inserting sensors");
					connection.query(
						{
							sql:"INSERT INTO Sensors (SID,Latitude,Longitude) VALUES ?;",
							values:[sensorArray]
						},
						function(err,results,fields){					
							if(err){
								// console.log(err);
								console.log("Sensor are already in DB.");
							}
							else{console.log("Inserted "+results.affectedRows+" sensors into DB.");}
							close(connection);
						}
					);			
				}else{console.log("connection is undefined");}				
			}
		});		

	};

	var insertSensor = function(sensor){
		pool.getConnection(function(err,connection){
			if(err){console.log(err);}
			else{
				if(connection !== undefined){
					connection.query(
						{
							sql:"INSERT INTO Sensors SET ?;",
							values:sensor
						},
						function(err,results,fields){					
							if(err){console.log(err);}
							else{console.log("inserted new sensor id:"+sensor.SID);}
							close(connection);
						}
					);			
				}
			}
		});		
	};

	var clearLiveReadings = function(){
		pool.getConnection(function(err,connection){
			if(err){console.log(err);}
			else{
				connection.query(
					{
						// sql:"DELETE FROM Live;"
						sql:"TRUNCATE Live;"
					},
					function(err,results,fields){
						if(err){console.log(err);}
						else{console.log("Cleared live table.");}
						close(connection);
					}
				);
			}
		});
	};

	//batch
	var insertLiveReadings = function(sensorData,callback){
		var sqlQuery = "TRUNCATE Live;"+
			"INSERT INTO Live (Sensors_SID,TIME,Frequency,Readings,Completed) VALUES ?;";

		pool.getConnection(function(err,connection){
			if(err){console.log(err);}
			else{
				connection.query(
					{
						// sql:"DELETE FROM Live;"
						sql:"TRUNCATE Live;"
					},
					function(err,results,fields){
						if(err){console.log(err);}
						else{
							console.log("Cleared live table.");			
							connection.query(
								{
									sql:sqlQuery,
									values:[sensorData]
								},
								function(err,results,fields){
									if(err){console.log(err);}
									else{console.log("Inserted live readings");}
									close(connection);
									callback(insertLiveReadings);
								}
							);
						}
					}
				);
			}	
		});
	};

	var insertHistoricalReadings = function(sensorData){
		// var connection = connect();
		pool.getConnection(function(err,connection){
			if(err){console.log(err);}
			else{
				if(connection !== undefined){
					connection.query(
						{
							sql:"INSERT INTO Recorded_Data (Sensors_SID,TIME,Frequency,Readings,Completed) VALUES ?;",
							values:[sensorData]
						},
						function(err,results,fields){
							if(err){console.log(err);}
							else{console.log("Number of readings recorded for historical readings: "+results.affectedRows);}
							close(connection);
						}
					);
				}				
			}
		});
	};

	var close = function(connection){
		connection.release();
		// console.log("DB connection released");
	};

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