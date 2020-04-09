const args = process.argv;
args.splice(0, 2);

const octopus = require("./index.js");
if (args.length !== 2) {
	octopus.handleError("Expected to receive 2 params: folderName and gitUrl.");
}

const folderName = args[0];
const gitUrl = args[1];

const BASIC_CONFIG_ELEMENT = {
	"name": folderName,
	"src": gitUrl,
	"actions": [{
		"type": "smartClone",
		"target": ".",
		"collectLog": false
	}, {
		"type": "execute",
		"cmd": `cd ${folderName} && npm install`
	}, {
		"type": "execute",
		"cmd": `cd ${folderName} && npm build`
	}]
};

const config = octopus.readConfig();

for (let i = 0; i < config.dependencies.length; i++) {
	let dep = config.dependencies[i];
	if (dep.name === folderName) {
		//console.log("Config found", dep);
		octopus.handleError(`There is a configuration for "${folderName}"`);
	}
}

config.dependencies.push(BASIC_CONFIG_ELEMENT);

octopus.updateConfig(config, function (err) {
	if (err) {
		throw err;
	}
	console.log("Configuration updated!");
});