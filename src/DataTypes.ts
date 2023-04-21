export enum DataTypes {
    register = "register",
    error = "error",
    name = "name",
    message = "message",
    request = "request",
    answer = "answer",
    deploy = "deploy",
    send = "send",
}

export let DataTypesObject = "{";

export const init = () => {
    let i = 0;
    for (const key in DataTypes) {
        DataTypesObject = DataTypesObject.concat((i > 0?", ":""), key, " = \"", DataTypes[key], "\"");
        i+=1;
    }
    DataTypesObject = DataTypesObject.concat("}")
}

export const getDataType = (dataType: string): DataTypes => {
    for (const key in DataTypes) {
        if(dataType === key){
            return DataTypes[key];
        }
    }
    return undefined;
}