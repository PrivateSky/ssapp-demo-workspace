const path = require("path");
const CONFIG_FILE_PATH = path.resolve(path.join(__dirname, "./../octopus.json"));
console.log(CONFIG_FILE_PATH);

function createBasicConfig(...configParts) {
	return {"workDir": ".", "dependencies": [...configParts]};
}

function readConfig() {
	let config;
	try {
		config = require(CONFIG_FILE_PATH);
	} catch (err) {
		if (err.code === "MODULE_NOT_FOUND") {
			config = createBasicConfig();
		} else {
			throw err;
		}
	}
	return config;
}

function updateConfig(config, callback) {
	const fs = require("fs");
	try {
		fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(config), callback);
	} catch (e) {
		callback(e);
	}
}

function runConfig(config, callback) {
	const updater = require("deployer");

	updater.setTag("[Octopus]");
	updater.run(config, callback);
}

module.exports = {
	createBasicConfig,
	readConfig,
	updateConfig,
	runConfig
};