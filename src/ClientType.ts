export enum ClientType {
    mine = "mine",
    server = "server",
    storage = "storage",
    ext = "ext"
}

export let ClientTypesObject = "{";

export const init = () => {
    let i = 0;
    for (const key in ClientType) {
        ClientTypesObject = ClientTypesObject.concat((i > 0?", ":""), key, " = \"", ClientType[key], "\"");
        i+=1;
    }
    ClientTypesObject = ClientTypesObject.concat("}")
}

export const getClientType = (clientType: string): ClientType => {
    for (const key in ClientType) {
        if(clientType === key){
            return ClientType[key];
        }
    }
    return ClientType.ext;
}