import * as fs from "fs";

let names: string[];

fs.readFile("./names.txt", (err, data) => {
    if(err){
        console.error(err);
        process.exit(1);
    }
    else{
        names = data.toString().split("\n");
    }
})

export const getName = () => {
    return names[Math.floor(Math.random() * names.length)].replace("\r", "");
}