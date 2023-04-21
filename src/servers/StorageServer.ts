import {BaseServer} from "./BaseServer";
import {Position} from "../position";
import { WebSocket } from "ws";
import {DataTypes} from "../DataTypes";

interface Item{
    itemId: string,
    chest?: Position,
    amount: number,
    col?: number
}

export class StorageServer extends BaseServer{
    items: Item[];

    request = (items: Item[], pos: Position, ws: WebSocket, id: number, headless: boolean = false) => {

        const itemsLeft: Map<string, number> = new Map<string, number>();

        for(const item of items){
            if(itemsLeft.has(item.itemId)){
                itemsLeft.set(item.itemId, item.amount+itemsLeft.get(item.itemId));
            }else{
                itemsLeft.set(item.itemId, item.amount);
            }
        }

        const itemsToGet: Item[] = [];

        for( const item of this.items){
            if(itemsLeft.has(item.itemId)){
                if(itemsLeft.get(item.itemId) > 0) {
                    if (itemsLeft.get(item.itemId) - item.amount < 0){
                        let tmpItem = {...item}
                        tmpItem.amount = item.amount - itemsLeft.get(item.itemId)
                        itemsToGet[itemsToGet.length] = tmpItem;
                    }else {
                        itemsToGet[itemsToGet.length] = {...item};
                    }
                    itemsLeft.set(item.itemId, itemsLeft.get(item.itemId) - item.amount);
                    if(itemsLeft.get(item.itemId) <= 0){
                        itemsLeft.delete(item.itemId);
                    }
                }
            }
        }
        console.log(itemsToGet);
        let unavailableItems = "";
        itemsLeft.forEach((item, amount) => {
            unavailableItems += `${amount} of ${item} is not available\n`
        });
        if(unavailableItems && !headless) {
            ws.on('message', (data: Buffer) => {
                const json = JSON.parse(data.toString());
                if(json.type == DataTypes.answer){
                    if(json.value){
                        requestAgree(itemsToGet, pos);
                    }
                }
            });
        }else{
            requestAgree(itemsToGet, pos);
        }
    }
}

const requestAgree = (itemsToGet: Item[], pos: Position) => {

}