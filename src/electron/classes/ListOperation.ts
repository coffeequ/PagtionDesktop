import { app, net } from "electron";
import { existsSync, mkdirSync, readFile, writeFile } from "fs";
import path from "path";
import { Operation } from "./Operation.js";
import { promisify } from "util";
import { IOperationQueue } from "../interfaces/IOperationQueue.js";
import { TypeOperations } from "../enums/TypeOperation.js";

export class DirectoryLO{

    /**
     *Создание файла для записи очередей
     */
    constructor() {
        this.createListOpearionFile();
    }

    //TODO: Сделать хеш-мапу для операций. То есть, если допустим была операция добавления и затем удаления
    // одной и той же заметки в целях экономии ресурсов, будет менять её состояние, а не сначала делать операцию по сохранению, 
    // а затем удаления

    private userPath: string = app.getPath("userData");

    private folderPath: string = path.join(this.userPath, "ListOperaion");

    private fileName: string = "OperationOffline";

    private filePath = `${this.folderPath}/${this.fileName}.json`;

    private timer: NodeJS.Timeout | null = null;

    private isStatusSend: boolean = false;

    private isSync: boolean = true;

    //0 - POST, 1 - PUT, 2 - DELETE
    private operationQueue: IOperationQueue = {
        [TypeOperations.POST]: [],
        [TypeOperations.PUT]: [],
        [TypeOperations.DELETE]: []
    };

    private readFileAsync = promisify(readFile);

    private writeFileAsync = promisify(writeFile);

    private handleFetchData = async (operation: Operation) => {
        const res = await net.fetch("http://localhost:3000/api/testDocuments", {
            method: operation.typeOperation,
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(operation.note)
        });
        return res.ok;
    }

    handleGetSyncStatus = () => {
        return this.isSync;
    }

    //Метод для создания файла очереди операций
    async createListOpearionFile(){
        console.log("Method work and create list for queue!");
        if(!existsSync(this.folderPath)){
            mkdirSync(this.folderPath, {recursive: true});
                const operationQueue: IOperationQueue = {
                    [TypeOperations.POST]: [],
                    [TypeOperations.PUT]: [],
                    [TypeOperations.DELETE]: []
                };
            await this.writeFileAsync(this.filePath, JSON.stringify(operationQueue));
        }
    }

    //Метод для записи операции в файл и очередь
    async writeOperationFile(operation: Operation){

        this.operationQueue[operation.typeOperation].push(operation);

        const body = JSON.stringify(this.operationQueue);

        try {
            await this.writeFileAsync(this.filePath, body);
        } catch {
            throw new Error("Error write note!");
        }
    }

    //Метод для чтения очереди операций
    async readOpeartionFile(){
        try {
            const data = await this.readFileAsync(this.filePath, "utf-8");
            const parseData = JSON.parse(data);
            this.operationQueue = parseData;
        } catch {
            throw new Error("Read file async");
        }
    }

    //Метод для отправки операций
    private async sendOperaionLoop(){
        if(this.isStatusSend){
            await this.readOpeartionFile();
            for(const typeOp of [TypeOperations.POST, TypeOperations.PUT, TypeOperations.DELETE]){
                console.log("send typeOp: ", typeOp);
                console.log("lenght: ", this.operationQueue[typeOp]);
                while(this.operationQueue[typeOp].length){
                    console.log("lenght-before: ", this.operationQueue[typeOp]);
                    const op = this.operationQueue[typeOp].shift();
                    console.log("op-:", op);
                    if(op){
                        const res = await this.handleFetchData(op);
                        if(!res){
                            console.log("res-unshift: ", res);
                            this.operationQueue[typeOp].unshift(op);
                        }
                        const body = JSON.stringify(this.operationQueue);
                        this.writeFileAsync(this.filePath, body, "utf-8");
                        this.isSync = true;
                    }
                }
            }
        }
        
        this.timer = setTimeout(async () => await this.sendOperaionLoop(), 5000);
    }

    async startSendOperation() {
        this.isStatusSend = true;
        console.log("start send operation");
        await this.sendOperaionLoop();
    }

    stopSendOperation() {
        this.isStatusSend = false;
        console.log("end send operation");
        if(this.timer){
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
}