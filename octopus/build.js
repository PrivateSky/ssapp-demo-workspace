const args = process.argv;
args.splice(0, 2);

if(args.length !== 1){
	console.log("args", ...args);
	throw new Error("Expected to receive 1 param: folderName that needs to be built");
}

const folderName = args[0];

const octopus = require("./index.js");
const config = octopus.readConfig();

let configPart;
for(let i=0; i<config.dependencies.length; i++){
	let dep = config.dependencies[i];
	if(dep.name === folderName){
		configPart = dep;
	}
}

if(typeof configPart === "undefined"){
	throw new Error(`No config found for target "${folderName}"`);
}

configPart.actions.push({
	"type": "execute",
	"cmd": `cd ${folderName} && npm run build`
});

octopus.runConfig(octopus.createBasicConfig(configPart), function(err, result){
	if(err){
		throw err;
	}

	octopus.updateConfig(config, function(err){
		if(err){
			throw err;
		}
		console.log("Configuration updated!");
	});
});