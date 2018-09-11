# HelloWorldAPI
Simple 'Hello World' RESTful API written with raw Node (no third-party modules). The app is set up to run across all cores on the host machine using the native 'os' and 'cluster' modules.


### Say Hello
Endpoint: `<host>`:`<port>`/hello  
Method: POST/PUT 
Request body: arbitrary payload must be in JSON format 
Required fields : none  
  
Sample request

```
{
	"firstName":"John",
	"lastName":"Doe"
}
```  
  
Sample response  
  
  ```
  {
    "endpoint": "/hello",
    "message": "Hello world, how are you?",
    "payload": {
        "firstName": "John",
        "lastName": "Doe"
    }
}
```
  
Method: GET/DELETE  

``` 
{
    "endpoint": "/hello",
    "message": "Hello world, how are you?"
}
```

### Say Goodbye
Endpoint: `<host>`:`<port>`/`<someInvalidEndpoint>`  
Method: GET/POST/PUT/DELETE
  

Sample response  
  
```
{
    "error": "Resource '/someInvalidEndpoint' not found, goodbye."
}
```
