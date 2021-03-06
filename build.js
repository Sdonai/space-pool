const fs = require('fs-extra')
const UglifyJS = require("uglify-js");
const babel = require("babel-core");

var bundle = [
	"./js/Tools.js",
    "./js/Asteroid.js", 
    "./js/Cannon.js",
    "./js/Collision.js",
    "./js/GraphicsCommon.js",
    "./js/ImageLoading.js",
    "./js/Input.js",
    "./js/Main.js",
    "./js/MovingWrapPosition.js",
    "./js/RailSlug.js",
    "./js/Scratch.js",
    "./js/Ship.js",
    "./js/SoundLoading.js",
    "./js/Stats.js",
    "./js/UI.js",
];

//Bundle JS
var input = __dirname+ "/";
var output = __dirname + "/docs/";
var raw = "" //txt buffer

//clean that shit up
fs.emptyDirSync(output)

//read
for(var i in bundle){
	raw += fs.readFileSync(bundle[i])
}
console.log("loggin rawww")
//console.log(raw)
//es6
var parsed = babel.transform(raw, {presets: ["es2015"] });

//minify
var result = UglifyJS.minify(parsed.code, {
	mangle: false,
	compress: false,
	fromString: true
});

//write
fs.outputFile(output + "client.min.js", result.code, err => {
  if (err) return console.error(err)
  console.log("Wrote client.min.js!")
})

//Copy index.html
var index = __dirname + "index-webpack.html"
fs.copy(input + "index-webpack.html", output + "index.html", err => {
  if (err) return console.error(err)
  console.log("Wrote index.html!")
});

//Copy assets
var includeDir = ["images", "music"]
for(var path of includeDir){
	fs.copy(input + path, output + path, err => {
	  if (err) return console.error(err)
	  	console.log("Wrote " + path)
});
}


