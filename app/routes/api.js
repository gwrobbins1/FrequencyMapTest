var bodyParser = require("body-parser");
var sensorModule = require("../modules/sensor");

module.exports = function(app,express,sensorModule){
	var apiRouter = express.Router();

	apiRouter.route("/live")
	.get(function(req, res){
		// console.log("request received");
		res.json(sensorModule.getLiveSensorReadings());
	});

	return apiRouter;
};