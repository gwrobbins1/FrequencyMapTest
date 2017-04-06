var bodyParser = require("body-parser");
var sensorModule = require("../modules/sensor");

module.exports = function(app,express,sensorModule){
	var apiRouter = express.Router();

	apiRouter.route("/live")
	.get(function(req, res){
		// console.log("request received");
		res.json(sensorModule.getLiveSensorReadings());
	});

	apiRouter.route("/historical/:filters")
	.get(function(req,res){
		var params = req.params.filters;
		console.log(params);
		//parse filter data to generate query
		var tokens = params.split('#',3);
		console.log(tokens);

		res.json({"message":"test server received request with parameters: "+tokens});
	});

	return apiRouter;
};