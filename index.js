const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
var bodyParser = require('body-parser')
const request = require('request');


app.listen(port, () => console.log(`Listening on port ${port}`));

var jsonParser = bodyParser.json()

app.post('/search', jsonParser, function (req, res) {

    var requestEndpoint = 'https://collectionapi.metmuseum.org/public/collection/v1/search?q=' + req.body.data

    request(requestEndpoint, function (error, response, body) {
        if (error) {
            res.status(500).send({ error: error });
        } else {
            res.status(200).send(body);
        }
    });
});


app.post('/object', jsonParser, function (req, res) {
    console.log(req.body);
    let responseSent = false;
    let index = 0;

    function makeRequest() {
        if (index >= req.body.data.length) {
            return;
        }
        if (responseSent) {
            return;
        }
        const objectID = req.body.data[index];
        const url = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/' + objectID;
        request(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                const result = JSON.parse(body);
                if (result.primaryImage) {
                    console.log(result);
                    res.send(result);
                    responseSent = true;
                    return;
                }
            }
            index++;
            makeRequest();
        });
    }
    makeRequest();
});