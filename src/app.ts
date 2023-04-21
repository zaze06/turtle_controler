import * as http from "http";
import * as ws from "ws";
import * as fs from "fs";
import {Client} from "./Client";
import * as ClientType from "./ClientType";
import {getName} from "./Names";
import * as DataType from "./DataTypes";
import {DataTypes} from "./DataTypes";
import * as RequestType from "./RequestTypes";
import {RequestTypes} from "./RequestTypes";
import {Server} from "./Server";
import * as ServerType from "./ServerTypes";
import {StorageServer} from "./servers/StorageServer";
import * as readline from 'readline';
import {ServerTypes} from "./ServerTypes";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const hostname: string = '127.0.0.1';
const port: number = 8080;
const wssPort: number = 8081;

DataType.init();
ClientType.init();
RequestType.init();
ServerType.init()

console.log(DataType.DataTypesObject);
console.log(ClientType.ClientTypesObject);

const luaEnums = {
        dataTypes: "local DataTypes = ".concat(DataType.DataTypesObject),
        clientTypes: "local ClientTypes = ".concat(ClientType.ClientTypesObject),
        requestTypes: "local RequestTypes = ".concat(RequestType.RequestTypesObject),
        serverType: "local ServerTypes = ".concat(ServerType.ServerTypeObject)
};

const server = http.createServer((req , res) => {
    if(req.url == "/"){
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end("file not found")
    }else{
        let file: string = "";
        if(!req.url.endsWith(".lua")){
            file = req.url.concat(".lua");
        }else{
            file = req.url.concat("");
        }

        fs.readFile("./turtle"+file,(err, data) => {
            if(err){
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end("Shit fuked up! "+err);
            }else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                let file = data.toString();
                file = file.replace("local DataTypes = {}", luaEnums.dataTypes);
                file = file.replace("local ClientTypes = {}", luaEnums.clientTypes);
                file = file.replace("local RequestTypes = {}", luaEnums.requestTypes);
                file = file.replace("local ServerTypes = {}", luaEnums.serverType);
                res.end(file);
            }
        })
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

const wss: ws.WebSocketServer = new ws.WebSocketServer({port: wssPort})

const servers: Map<number, Server> = new Map<number, Server>;
const clients: Map<number, Client> = new Map<number, Client>;
const sockets: Map<number, (data: Buffer) => void> = new Map<number, (data: Buffer) => void>;

export const getMessageHanlder = (id: number) => {
    if(sockets.has(id)){
        return sockets.get(id);
    }else{
        return undefined
    }
}

wss.on('connection', (ws: ws.WebSocket) => {
    ws.on('error', console.error);

    let id = 0;

    const messageHandler = (data: Buffer) => {
        let jsonData = JSON.parse(data.toString())
        console.log(jsonData);

        id = jsonData.id

        if(jsonData.type == DataTypes.register){
            if(jsonData.program === "server"){
                if(!servers.has(jsonData.id)){
                    const serv: Server = {
                        ws: ws,
                        id: id,
                        type: jsonData.serverType,
                        server: new StorageServer()
                    };
                    servers.set(jsonData.id, serv);
                    ws.send(JSON.stringify({type: DataTypes.message, message: "Success!"}))
                }else{
                    ws.send(JSON.stringify({type: DataTypes.error, error: "Server already registered"}));
                }
            }else if(jsonData.program === "client"){
                if(!clients.has(jsonData.id)){
                    let type: ClientType.ClientType;
                    switch (jsonData.programType) {
                        case "mine":
                            type = ClientType.ClientType.mine;
                            break;
                        default:
                            type = ClientType.ClientType.ext;
                            break;
                    };

                    let client: Client = {ws: ws, type: type, id: jsonData.id};
                    if(jsonData.name){
                        client.name = jsonData.name;
                    }else{
                        client.name = getName();
                        ws.send(JSON.stringify({type: DataTypes.name, name: client.name}));
                    }
                    clients.set(jsonData.id, client);
                }
                else{
                    ws.send(JSON.stringify({type: DataTypes.error, error: "Client already registered"}));
                }
            }
        }else if(jsonData.type == DataTypes.request){
            if(jsonData.requestType == RequestTypes.item){
                for (const clientsKey in servers) {
                    const server = servers.get(parseInt(clientsKey));
                    if(server.type == ServerTypes.storageServer){
                        const storageServer = server.server as StorageServer;

                        storageServer.request(null, null, null, null);
                    }
                }
            }
        }else if(jsonData.type == DataTypes.send){
            if(servers.has(jsonData.id)){
                servers.get(jsonData.id).ws.send(JSON.stringify(jsonData.command));
            }else
            if(clients.has(jsonData.id)){
                clients.get(jsonData.id).ws.send(JSON.stringify(jsonData.command));
            }
        }
    };

    sockets.set(id, messageHandler);

    ws.on('message', messageHandler);
});
