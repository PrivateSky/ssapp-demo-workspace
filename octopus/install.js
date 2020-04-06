const updater = require("deployer");
const octopus = require("./index");

const config = octopus.readConfig();

global.collectLog = false;
updater.setTag("[Octopus]");
updater.run(config, function (err) {
	if (err) {
		throw err;
	}
});