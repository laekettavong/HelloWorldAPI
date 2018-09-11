/*
* Simple application that returns JSON
*/

const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const cluster = require('cluster');
const os = require('os');


const HelloWorldApi = class HelloWorldApi {
    /*
    * Spawns worker processes across all cores to handle requests
    */
    static init() {
        if(cluster.isMaster) {
            // fork the process
            os.cpus().forEach((cpu) => {
                cluster.fork();
            });

        } else {
            // if we're not in the master thread, start the HTTP server
            ApiHandler.init(3000);
        }
    }
}

const ApiHandler = class ApiHandler {

    /*
    * Sets up server for requests
    * 
    * @param {port} port to listen for requests
    * 
    */
    static init(port) {
        this.router = new Map([['hello', this.sayHello]]);

        let server = http.createServer((req, res) => {
            this.handleRequest(req, res);
        });

        server.listen(port, () => {
            console.log(Colors.YELLOW, `The server is listening on port ${port}`);
        });
    }

    /*
    * Handles requests, parses payload accordingly
    * 
    * @param {req} HTTP request object
    * @param {res} HTTP response object
    * 
    */
    static handleRequest(req, res) {
        let parsedUrl = url.parse(req.url, true);
        let path = parsedUrl.pathname;
        let trimmedPath = path.replace(/^\/+|\/+$/g, '');
        let decoder = new StringDecoder('utf-8');
        let method = req.method.toUpperCase();
        let buffer = '';
        req.on('data', (data) => { buffer += decoder.write(data); });

        req.on('end', () => {
            buffer += decoder.end();
            let chosenHandler = typeof(this.router.get(trimmedPath)) !== 'undefined' ? this.router.get(trimmedPath): this.notFound;
            chosenHandler((statusCode) => {
                statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
                let data = { 'endpoint' : path }
                let isValidResource = true;
                
                res.setHeader('Content-Type', 'application/json')
                if(statusCode === 200){
                    data.message = 'Hello world, how are you?';
                } else {
                    data = { 'error' : `Resource '${path}' not found, goodbye.` };
                    isValidResource = false;
                    res.statusCode = statusCode;
                }

                if(isValidResource && buffer.length > 0  && method && (method === 'POST' || method === 'PUT')) {
                    let payload;
                    try {
                        data.payload = JSON.parse(buffer);
                    } catch(err) {
                        data.error = 'Payload has to be in well-formed JSON format';
                    }
                }

                res.end(JSON.stringify(data));
            });
        });
    }

    /*
    * Simply invokes a 'success' callback, main handler for this demo app
    * 
    * @param {callback} HTTP response object
    * 
    */
    static sayHello(callback) {
        callback(200);
    }

    /*
    * Simply invokes a 'not found' callback, default handler for invalid endpoints
    * 
    * @param {callback} HTTP response object
    * 
    */
    static notFound(callback) {
        callback(404);
    }
}

// Console output colors
const Colors =  {
    RED : '\x1b[31m%s\x1b[0m',
    GREEN : '\x1b[32m%s\x1b[0m',
    YELLOW : '\x1b[33m%s\x1b[0m',
    DARK_BLUE: '\x1b[34m%s\x1b[0m',
    MAGENTA : '\x1b[35m%s\x1b[0m',
    LIGHT_BLUE: '\x1b[36m%s\x1b[0m'
}

HelloWorldApi.init();
