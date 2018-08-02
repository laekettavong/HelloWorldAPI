/*
* Simple application that returns JSON
*/

const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const server = http.createServer((req, res) => {
    handleRequest(req, res);
})

server.listen(3000, () => {
    console.log('Listening on port 3000');
})

const handleRequest = (req, res) => {
    let parseUrl = url.parse(req.url, true);
    let path = parseUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');
    let decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });

    req.on('end', () => {
        buffer += decoder.end();
        let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handler.goodbye;
        chosenHandler((statusCode) => {
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            let data = {
                resource : trimmedPath,
                payload : buffer
            }
            res.setHeader('Content-Type', 'application/json')
            if(statusCode == 200){
                data.message = 'Hello world, thank you for posting';
            } else {
                data.message = 'Resource not found, goodbye';
                delete data.payload;
                res.statusCode = statusCode;
            }
            res.end(JSON.stringify(data));
        });
    });
};

const handler = {
    hello : (callback) => {
        callback(200);
    },
    goodbye : (callback) => {
        callback(404);
    }
}

const router = {
    hello : handler.hello
};