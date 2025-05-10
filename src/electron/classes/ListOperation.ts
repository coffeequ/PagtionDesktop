import { app, net } from "electron";
import { appendFileSync, existsSync, mkdirSync, readFile, writeFile } from "fs";
import path from "path";
import { Operation } from "./Operation.js";
import { promisify } from "util";

export class DirectoryLO{

    //TODO: Сделать хеш-мапу для операций. То есть, если допустим была операция добавления и затем удаления
    // одной и той же заметки в целях экономии ресурсов, будет менять её состояние, а не сначала делать операцию по сохранению, 
    // а затем удаления
    
    private userPath: string = app.getPath("userData");

    private folderPath: string = path.join(this.userPath, "ListOperaion");

    private fileName: string = "OperationOffline";

    private filePath = `${this.folderPath}/${this.fileName}.json`;

    arrSendOP: string[] = [];

    private readFileAsync = promisify(readFile);

    private handleFetchData = async (operation: Operation) => {
        const res = await net.fetch("http://localhost:3000/api/testDocument", {
            method: operation.typeOperation,
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(operation.data)
        });
        return res.status;
    }

    createListOpearion(){
        console.log("Метод сработал");
        if(!existsSync(this.folderPath)){
            mkdirSync(this.folderPath, {recursive: true});
        }
        writeFile(this.filePath, "", ((err) => {
            if(err){
                throw new Error("Ошибка создания файла учета офлайн операций!");
            }
        }));
    }

    writeOperation(operation: Operation){
        const body = JSON.stringify(operation);
        appendFileSync(this.filePath, `\n${body}`);
    }

    async readOperation(){
        try {
            const resRead = await this.readFileAsync(this.filePath, "utf-8");
            this.arrSendOP = [...this.arrSendOP, JSON.stringify(resRead)];
        } catch {
            throw new Error("Ошибка чтения журнала операций");
        }
    }

    sendOperaion(){
        if(this.arrSendOP.length === 0){
            return;
        }
        else{
            for(const item of this.arrSendOP){
                try {
                    const body: Operation = JSON.parse(item);
                    const status = this.handleFetchData(body);
                    console.log(status);
                } catch {
                    throw new Error("Ошибка синхронизации");
                }
            }
        }
    }
}