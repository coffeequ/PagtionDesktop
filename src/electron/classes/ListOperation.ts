import { app, net } from "electron";
import { existsSync, mkdirSync, readFile, writeFile } from "fs";
import path from "path";
import { Operation } from "./Operation.js";
import { promisify } from "util";
import { IOperationQueue } from "../interfaces/IOperationQueue.js";
import { TypeOperations } from "../enums/TypeOperation.js";

export class DirectoryLO{

    //TODO: Сделать хеш-мапу для операций. То есть, если допустим была операция добавления и затем удаления
    // одной и той же заметки в целях экономии ресурсов, будет менять её состояние, а не сначала делать операцию по сохранению, 
    // а затем удаления

    private userPath: string = app.getPath("userData");

    private folderPath: string = path.join(this.userPath, "ListOperaion");

    private fileName: string = "OperationOffline";

    private filePath = `${this.folderPath}/${this.fileName}.json`;

    private timer: NodeJS.Timeout | null = null;

    //0 - POST, 1 - PUT, 2 - DELETE
    private operationQueue: IOperationQueue = {
        [TypeOperations.POST]: [],
        [TypeOperations.PUT]: [],
        [TypeOperations.DELETE]: []
    };

    private handleFetchData = async (operation: Operation) => {
        const res = await net.fetch("http://localhost:3000/api/testDocuments", {
            method: operation.typeOperation.toString(),
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(operation.note)
        });
        console.log(res.status);
    }

    //Метод для создания файла очереди операций
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

    //Метод для записи операции в файл и очередь
    writeOperation(operation: Operation){

        this.operationQueue[operation.typeOperation].push(operation);

        const body = JSON.stringify(this.operationQueue);

        writeFile(this.filePath, body, (err) => {
            if(err){
                throw new Error("Error write note!");
            }
        });
    }

    //Метод для чтения очереди операций
    async readOperation(){
         console.log("start read");
            await readFile(this.filePath, "utf-8", (err, data) => {
                if(err){
                    this.operationQueue = {
                        [TypeOperations.POST]: [],
                        [TypeOperations.PUT]: [],
                        [TypeOperations.DELETE]:[]
                    }
                    throw new Error("Error read data");
                }
                else{
                    const body: IOperationQueue = JSON.parse(data)
                    this.operationQueue = body
                    console.log("body-reading: ", body);
                }
            });
            console.log("after read queue: ", this.operationQueue);
    }

    //Метод для отправки операций
    private async sendOperaionLoop(){
        console.log("send this operation queue: ", this.operationQueue);
        for(const typeOp of [TypeOperations.POST, TypeOperations.PUT, TypeOperations.DELETE]){
            console.log("send typeOp: ", typeOp);
            console.log("lenght: ", this.operationQueue[typeOp].length);
            while(this.operationQueue[typeOp].length){
                const op = this.operationQueue[typeOp].shift()!;
                try {
                    await this.handleFetchData(op);
                } catch {
                    this.operationQueue[typeOp].unshift(op);
                    throw new Error("Error synchronization")
                }
            }
        }

        const body = JSON.stringify(this.operationQueue);

        writeFile(this.filePath, body, (err) => {
            if(err){
                throw new Error("Error save queue in file");
            }
        })

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