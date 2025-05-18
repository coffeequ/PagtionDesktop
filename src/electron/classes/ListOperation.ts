import { app, net } from "electron";
import { existsSync, mkdirSync, readFile, writeFile } from "fs";
import path from "path";
import { Operation } from "./Operation.js";
import { promisify } from "util";

export class DirectoryLO{

    //TODO: Сделать хеш-мапу для операций. То есть, если допустим была операция добавления и затем удаления
    // одной и той же заметки в целях экономии ресурсов, будет менять её состояние, а не сначала делать операцию по сохранению, 
    // а затем удаления
    
    // syncStatus: boolean = false;

    private userPath: string = app.getPath("userData");

    private folderPath: string = path.join(this.userPath, "ListOperaion");

    private fileName: string = "OperationOffline";

    private filePath = `${this.folderPath}/${this.fileName}.json`;

    arrSendOP: Operation[] = [];

    private readFileAsync = promisify(readFile);

    private timer: NodeJS.Timeout | null = null;

    private handleFetchData = async (operation: Operation) => {
        const res = await net.fetch("http://localhost:3000/api/testDocuments", {
            method: operation.typeOperation,
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(operation.note)
        });
        return res.status;
    }

    createListOpearion(){
        console.log("Метод сработал");
        if(!existsSync(this.folderPath)){
            mkdirSync(this.folderPath, {recursive: true});
            writeFile(this.filePath, "", ((err) => {
            if(err){
                throw new Error("Error of create list operation!");
            }
            }));
        }
    }

    writeOperation(operation: Operation){
        this.arrSendOP.push(operation);
        const body = JSON.stringify(this.arrSendOP);
        writeFile(this.filePath, body, (err) => {
            if(err){
                throw new Error("Error write note!");
            }
        });
    }

    async readOperation(){
        try {
            const resRead = await this.readFileAsync(this.filePath, "utf-8");
            this.arrSendOP = JSON.parse(resRead);
        } catch {
            throw new Error("Error read folder");
        }
    }

    private async sendOperaionLoop(){
            console.log("Timer working");
            if(this.arrSendOP.length === 0){
                console.log("arrSend - empty");
                return;
            }
            else{
                console.log("Timer working... Send opearion");
                console.log(this.arrSendOP);
                for(const item of this.arrSendOP){
                    try {
                        const status = await this.handleFetchData(item);
                        console.log(status);
                    } catch {
                        throw new Error("Ошибка синхронизации");
                    }
                }
                this.arrSendOP = [];
            }
        this.timer = setTimeout(() => this.sendOperaionLoop(), 5000);
    }

    startSendOperation() {
        console.log("start send operation");
        this.sendOperaionLoop();
    }

    stopSendOperation() {
        console.log("end send operation");
        if(this.timer){
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
}