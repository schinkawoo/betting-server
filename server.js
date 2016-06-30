/**
 * Created by nes on 23/06/16.
 */
var express = require('express');
var app = express();
var fs = require("fs");

var getMatch = (request, response) => {
    fs.readFile( __dirname + "/data/"+request.path.split("/")[1]+"/" + "matches.json", 'utf8', function (err, data) {
        var matches = JSON.parse(data);

        if(request.params.id) {
            var match = matches.filter((match)=>match.id == request.params.id);
            if(match.length > 0) {
                response.send(JSON.stringify(match[0]))
            } else {
                response.send(JSON.stringify({
                    "error": "Match with id: " + request.params.id + " not found!!!"
                }));
            }
        } else if(matches.length > 0){
            response.send(JSON.stringify(matches));
        } else {
            response.send(JSON.stringify({
                "error": "Something went wrong!!!"
            }));
        }
    });
};

var getMatches = (request, response) => {
    fs.readFile( __dirname + "/data/"+request.path.split("/")[1]+"/" + "matches.json", 'utf8', function (err, data) {
        if(!err && JSON.parse(data).length > 0){
            response.send(JSON.stringify(JSON.parse(data)));
        } else {
            response.send(JSON.stringify({
                "error": "No matches found!!!"
            }));
        }
    });
};

var getAllMatches = (request, response) => {
    var result = [];

    const matchesFiles = ["/data/group-phase/matches.json", "/data/knockout-phase/matches.json"];

    matchesFiles.forEach((matchesFile) => {
        result = result.concat(JSON.parse(fs.readFileSync(__dirname + matchesFile, 'utf8',(err, data) => {
            return data;
        })));
    });

    response.send(JSON.stringify(result));
}

var getPredictions = (request, response) => {
    var predictionDir = __dirname + "/data/"+request.path.split("/")[1]+"/predictions/";
    var predictionFiles = fs.readdirSync(predictionDir);
    var predictions = {};

    predictionFiles.forEach((fileName)=>{
        var key = fileName.split(".")[0];
        predictions[key] = JSON.parse(fs.readFileSync(predictionDir + fileName, 'utf8',(err, data) => {
            return data;
        }));
    });

    if(Object.keys(predictions).length > 0) {
        response.send(JSON.stringify(predictions));
    } else {
        response.send(JSON.stringify({
            "error": "No predictions found!!!"
        }));
    }
}

var getPrediction = (request, response) => {
    var predictionDir = __dirname + "/data/"+request.path.split("/")[1]+"/predictions/";
    var predictionFiles = fs.readdirSync(predictionDir);
    var fileName = predictionFiles.filter((fileName)=>fileName.split(".")[0] == request.params.id)[0];
    response.send(JSON.parse(fs.readFileSync(predictionDir + fileName, 'utf8',(err, data) => {
        if(err) {
            return JSON.stringify({
                "error": "No predictions found!!!"
            })
        } else {
            return data;
        }

    })));
}

var getAllPredictions = (request, response) => {
    var predictions = {};
    const predictionDirs = ["/data/group-phase/predictions/", "/data/knockout-phase/predictions/"].map(dir => __dirname + dir);
    
    predictionDirs.forEach((predictionDir) => {
        var predictionFiles = fs.readdirSync(predictionDir);
        predictionFiles.forEach((fileName)=>{
            var key = fileName.split(".")[0];
            const newPredictions = JSON.parse(fs.readFileSync(predictionDir + fileName, 'utf8',(err, data) => {
                return data;
            }));

            predictions[key] = (predictions[key] ? predictions[key] : []).concat(newPredictions);
        });
    });

    response.send(JSON.stringify(predictions));
}

app.get('/group-phase/matches/:id', function (request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header("Content-Type", "application/json");
    getMatch(request, response)
});

app.get('/knockout-phase/matches/:id', function (request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header("Content-Type", "application/json");
    getMatch(request, response)
});

app.get('/group-phase/matches/', function (request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header("Content-Type", "application/json");
    getMatches(request, response);
});

app.get('/knockout-phase/matches/', function (request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header("Content-Type", "application/json");
    getMatches(request, response);
});

app.get('/group-phase/predictions/', function (request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header("Content-Type", "application/json");
    getPredictions(request, response);
});

app.get('/knockout-phase/predictions/', function (request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header("Content-Type", "application/json");
    getPredictions(request, response);
});

app.get('/group-phase/predictions/:id', function (request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header("Content-Type", "application/json");
    getPrediction(request, response);
});

app.get('/knockout-phase/predictions/:id', function (request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header("Content-Type", "application/json");
    getPrediction(request, response);
});

app.get('/matches', function (request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header("Content-Type", "application/json");
    getAllMatches(request, response);
});

app.get('/predictions', function (request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header("Content-Type", "application/json");
    getAllPredictions(request, response);
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port 3000!');
});