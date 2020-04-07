const argIdentifier = "--file=";
const errorMessage = `Misuse of script. Syntax node path_to_script ${argIdentifier}'path_to_env_file' \"[npm cmd] [node cmd]\"`;
const args = process.argv;
args.splice(0, 2);
console.log(args);

if(args.length <2){
	//throw new Error("This script expects exactly one argument as path to a JSON file that contains env variables that need to be set up.");
	throw new Error(errorMessage);
}

let fileArg = args.shift();
if(fileArg.indexOf(argIdentifier) === -1){
	throw new Error(errorMessage);
}
fileArg = fileArg.replace(argIdentifier, "");

let envJson;
try{
	envJson = require(fileArg);
}catch(err){
	throw new Error("env file not found or contains an invalid JSON!");
}

const {spawn} = require("child_process");
Object.assign(process.env, envJson);
console.log("Environment updated accordingly to env file passed as argument.");

const spawn_cmd = args.join(" ");

console.log("Preparing to execute cmd", spawn_cmd);
spawn(spawn_cmd, undefined, {shell: true, stdio: "inherit"});