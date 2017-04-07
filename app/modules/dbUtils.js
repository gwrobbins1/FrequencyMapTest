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
					sql:"SELECT SID FROM live_data;",
					values:sensorData
				},
				function(err,results,fields){
					if(err){console.log(err);}
					console.log(results[0].SID);
				}
			);

			// connection.query(
			// 	{
			// 		sql:"INSERT INTO live_data SET ?;",
			// 		values:sensorData
			// 	},
			// 	function(err,results,fields){
			// 		if(err){console.log(err);}
			// 	}
			// );
			// console.log("inserted sensor id:"+sensor.SID+" readings at:"+sensor.TIME);
		}
	};

	var insertHistoricalReadings = function(sensorData){
		if(connection !== null){
			sensorData['Completed'] = 1;
			connection.query(
				{
					sql:"INSERT INTO Recorded_data SET ?;",
					values:sensorData
				},
				function(err,results,fields){
					if(err){console.log(err);}
				}
			);
			// console.log("inserted sensor id:"+sensor.SID+" readings at:"+sensor.TIME);
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
		insertHistoricalReadings : insertHistoricalReadings,
		insertLiveReadings : insertLiveReadings,
		close : close
	};
})();



module.exports = dbUtils;