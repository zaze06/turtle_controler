import { WebSocket } from "ws";
import { Client } from "../Client";

export class BaseServer {
    socket: WebSocket;
    clients: Client[];
}