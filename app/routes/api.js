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
		res.json({"message":"test server received request!"});
	});

	return apiRouter;
};