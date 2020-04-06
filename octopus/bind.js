const args = process.argv;
args.splice(0, 2);

if (args.length !== 2) {
	console.log("args", ...args);
	throw new Error("Expected to receive 2 params: <loaderFolderName> and <walletFolderName>.");
}

const loaderFolderName = args[0];
const walletFolderName = args[1];

const octopus = require("./index.js");

const config = octopus.readConfig();

function buildIdentifier() {
	return `${loaderFolderName}_bind_to_${walletFolderName}`;
}

let loaderConfigIndex;
let walletConfigIndex;
let binDep;
for (let i = 0; i < config.dependencies.length; i++) {
	let dep = config.dependencies[i];
	if (dep.name === loaderFolderName) {
		loaderConfigIndex = i;
	}

	if (dep.name === walletFolderName) {
		walletConfigIndex = i;
	}

	if (dep.name === buildIdentifier()) {
		binDep = config.dependencies[i];
	}
}

if (typeof loaderConfigIndex === "undefined") {
	throw new Error(`Unable to find a loader config called "${loaderFolderName}"`)
}

if (typeof walletConfigIndex === "undefined") {
	throw new Error(`Unable to find a wallet config called "${walletFolderName}"`)
}

if (typeof binDep === "undefined") {
	binDep = {
		"name": buildIdentifier(),
		"src": ""
	};

	config.dependencies.push(binDep);
}

binDep.actions = [];
binDep.actions.push({
	"type" : "copy",
	"src": `./${walletFolderName}/bindedSeed`,
	"target": `./${loaderFolderName}/bindedSeed`,
	"options": {
		overwrite: true
	}
});

octopus.runConfig(octopus.createBasicConfig(binDep), function(err){
	if(err){
		throw err;
	}
	octopus.updateConfig(config, function (err) {
		if (err) {
			throw err;
		}
		console.log("Bind successful and config updated!");
	});
});