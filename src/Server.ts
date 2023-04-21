import { WebSocket } from "ws";
import { ServerTypes } from "./ServerTypes"
import {BaseServer} from "./servers/BaseServer";

export interface Server {
    ws: WebSocket,
    id: number,
    type: ServerTypes,
    server: BaseServer
}