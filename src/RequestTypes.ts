export enum RequestTypes {
    mine = "mine",
    item = "item"
}

export let RequestTypesObject = "{";

export const init = () => {
    let i = 0;
    for (const key in RequestTypes) {
        RequestTypesObject = RequestTypesObject.concat((i > 0?", ":""), key, " = \"", RequestTypes[key], "\"");
        i+=1;
    }
    RequestTypesObject = RequestTypesObject.concat("}")
}

export const getDataType = (dataType: string): RequestTypes => {
    for (const key in RequestTypes) {
        if(dataType === key){
            return RequestTypes[key];
        }
    }
    return undefined;
}