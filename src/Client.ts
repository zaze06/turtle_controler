import { WebSocket } from "ws";
import { ClientType } from "./ClientType";

export interface Client{
    name?: string;
    ws: WebSocket;
    type: ClientType;
    id: number;
}