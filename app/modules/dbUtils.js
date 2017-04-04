'use strict';


var mysql = require("mysql");
var dbUtils = (function(){
	var configuration = null;
	var connection = null;

	var configure = function(config){
		configuration = config;
	};

	var connect = function(){
		if(configuration !== null){
			connection = mysql.createConnection({
				host:configuration.mySqlHost,
				user:configuration.user,
				password:configuration.password,
				database:configuration.database
			});	

			connection.connect();

			connection.query(
				{
					sql:"DELETE FROM sensors"
				},
				function(err,results,fields){
					if(err){console.log(err);	}
				}
			);

			console.log("DB connection opened");		
		}
	};

	var insert = function(sensor){
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

	var insertSensorReadings = function(sensor){
		if(connection !== null){
			connection.query(
				{
					sql:"INSERT INTO recorded_data SET ?;",
					values:sensor
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
			connection = null;
			console.log("DB connection closed");
		}
	}

	return {
		configure : configure,
		connect : connect,
		insert : insert,
		close : close,
		insertSensorReadings : insertSensorReadings
	};
})();



module.exports = dbUtils;