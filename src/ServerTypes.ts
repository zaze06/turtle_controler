export enum ServerTypes {
    deployServer = "deployServer",
    storageServer ="storageServer"
}

export let ServerTypeObject = "{";

export const init = () => {
    let i = 0;
    for (const key in ServerTypes) {
        ServerTypeObject = ServerTypeObject.concat((i > 0?", ":""), key, " = \"", ServerTypes[key], "\"");
        i+=1;
    }
    ServerTypeObject = ServerTypeObject.concat("}")
}

export const getDataType = (dataType: string): ServerTypes => {
    for (const key in ServerTypes) {
        if(dataType === key){
            return ServerTypes[key];
        }
    }
    return undefined;
}