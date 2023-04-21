"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessageHanlder = void 0;
var http = require("http");
var ws = require("ws");
var fs = require("fs");
var ClientType = require("./ClientType");
var Names_1 = require("./Names");
var DataType = require("./DataTypes");
var DataTypes_1 = require("./DataTypes");
var RequestType = require("./RequestTypes");
var RequestTypes_1 = require("./RequestTypes");
var ServerType = require("./ServerTypes");
var StorageServer_1 = require("./servers/StorageServer");
var readline = require("readline");
var ServerTypes_1 = require("./ServerTypes");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var hostname = '127.0.0.1';
var port = 8080;
var wssPort = 8081;
DataType.init();
ClientType.init();
RequestType.init();
ServerType.init();
console.log(DataType.DataTypesObject);
console.log(ClientType.ClientTypesObject);
var luaEnums = {
    dataTypes: "local DataTypes = ".concat(DataType.DataTypesObject),
    clientTypes: "local ClientTypes = ".concat(ClientType.ClientTypesObject),
    requestTypes: "local RequestTypes = ".concat(RequestType.RequestTypesObject),
    serverType: "local ServerTypes = ".concat(ServerType.ServerTypeObject)
};
var server = http.createServer(function (req, res) {
    if (req.url == "/") {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end("file not found");
    }
    else {
        var file = "";
        if (!req.url.endsWith(".lua")) {
            file = req.url.concat(".lua");
        }
        else {
            file = req.url.concat("");
        }
        fs.readFile("./turtle" + file, function (err, data) {
            if (err) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end("Shit fuked up! " + err);
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                var file_1 = data.toString();
                file_1 = file_1.replace("local DataTypes = {}", luaEnums.dataTypes);
                file_1 = file_1.replace("local ClientTypes = {}", luaEnums.clientTypes);
                file_1 = file_1.replace("local RequestTypes = {}", luaEnums.requestTypes);
                file_1 = file_1.replace("local ServerTypes = {}", luaEnums.serverType);
                res.end(file_1);
            }
        });
    }
});
server.listen(port, hostname, function () {
    console.log("Server running at http://".concat(hostname, ":").concat(port, "/"));
});
var wss = new ws.WebSocketServer({ port: wssPort });
var servers = new Map;
var clients = new Map;
var sockets = new Map;
var getMessageHanlder = function (id) {
    if (sockets.has(id)) {
        return sockets.get(id);
    }
    else {
        return undefined;
    }
};
exports.getMessageHanlder = getMessageHanlder;
wss.on('connection', function (ws) {
    ws.on('error', console.error);
    var id = 0;
    var messageHandler = function (data) {
        var jsonData = JSON.parse(data.toString());
        console.log(jsonData);
        id = jsonData.id;
        if (jsonData.type == DataTypes_1.DataTypes.register) {
            if (jsonData.program === "server") {
                if (!servers.has(jsonData.id)) {
                    var serv = {
                        ws: ws,
                        id: id,
                        type: jsonData.serverType,
                        server: new StorageServer_1.StorageServer()
                    };
                    servers.set(jsonData.id, serv);
                    ws.send(JSON.stringify({ type: DataTypes_1.DataTypes.message, message: "Success!" }));
                }
                else {
                    ws.send(JSON.stringify({ type: DataTypes_1.DataTypes.error, error: "Server already registered" }));
                }
            }
            else if (jsonData.program === "client") {
                if (!clients.has(jsonData.id)) {
                    var type = void 0;
                    switch (jsonData.programType) {
                        case "mine":
                            type = ClientType.ClientType.mine;
                            break;
                        default:
                            type = ClientType.ClientType.ext;
                            break;
                    }
                    ;
                    var client = { ws: ws, type: type, id: jsonData.id };
                    if (jsonData.name) {
                        client.name = jsonData.name;
                    }
                    else {
                        client.name = (0, Names_1.getName)();
                        ws.send(JSON.stringify({ type: DataTypes_1.DataTypes.name, name: client.name }));
                    }
                    clients.set(jsonData.id, client);
                }
                else {
                    ws.send(JSON.stringify({ type: DataTypes_1.DataTypes.error, error: "Client already registered" }));
                }
            }
        }
        else if (jsonData.type == DataTypes_1.DataTypes.request) {
            if (jsonData.requestType == RequestTypes_1.RequestTypes.item) {
                for (var clientsKey in servers) {
                    var server_1 = servers.get(parseInt(clientsKey));
                    if (server_1.type == ServerTypes_1.ServerTypes.storageServer) {
                        var storageServer = server_1.server;
                        storageServer.request(null, null, null, null);
                    }
                }
            }
        }
        else if (jsonData.type == DataTypes_1.DataTypes.send) {
            if (servers.has(jsonData.id)) {
                servers.get(jsonData.id).ws.send(JSON.stringify(jsonData.command));
            }
            else if (clients.has(jsonData.id)) {
                clients.get(jsonData.id).ws.send(JSON.stringify(jsonData.command));
            }
        }
    };
    sockets.set(id, messageHandler);
    ws.on('message', messageHandler);
});
//# sourceMappingURL=app.js.map