'use strict';
var mysql = require("mysql");
var dbUtils = (function(){
	var configuration = null;
	var connection = null;

	var init = function(config){
		configuration = config;
		connect();
		connection.query(
			{
				// sql:"DELETE FROM sensors; DELETE FROM live_data;"
				sql:"DELETE FROM sensors;"			
			},
			function(err,results,fields){
				if(err){console.log(err);	}
			}
		);
		connection.end();

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
		if(connection !== null){
			connection.query(
				{
					sql:"SELECT DISTINCT SID FROM live_data;",
				},
				function(err,results,fields){
					if(err){console.log(err);}
					else{
						if(results){
							if(results.length > 0){
								// console.log("---sid: "+results[0].SID);
								var updateData = [];
								results.forEach(function(data){
									// console.log("for each result sid: "+data.SID);
									sensorData.forEach(function(sensor){
										if(sensor[0] === data.SID){
											updateData.push(sensor[1]);//time
											updateData.push(sensor[2]);//frequency
											updateData.push(sensor[0]);//SID											
											updateData.push(sensor[3]);//readings
										}
									});
								});
								connect();
								connection.query(
									{
										// sql:"UPDATE live_data SET TIME=?, Readings=? WHERE SID=? AND Frequency=?;",
										sql:"UPDATE live_data (TIME, Readings) VALUES ? WHERE SID=? AND Frequency=?;",
										values:updateData
									},
									function(err,results,fields){
										if(err){console.log(err);}
										else{
											console.log("Updated "+results.affectedRows+" in live_data table.");
										}
									}
								);
								close();
							}else{
								connect();
								connection.query(
									{
										sql:"INSERT INTO live_data (SID,TIME,Frequency,Readings,Completed) VALUES ?;",
										values:[sensorData]
									},
									function(err,results,fields){
										if(err){console.log(err);}
										else{console.log("Number of readings recorded for live table: "+results.affectedRows);}
									}
								);
								close();
							}							
						}else{
							connect();
							connection.query(
								{
									sql:"INSERT INTO live_data (SID,TIME,Frequency,Readings,Completed) VALUES ?;",
									values:[sensorData]
								},
								function(err,results,fields){
									if(err){console.log(err);}
									else{console.log("Number of readings recorded for live table: "+results.affectedRows);}
								}
							);
							close();
						}
					}
				}
			);


		}
	};

	var insertHistoricalReadings = function(sensorData){
		if(connection !== null){
			connection.query(
				{
					sql:"INSERT INTO Recorded_data (SID,TIME,Frequency,Readings,Completed) VALUES ?;",
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