import { app, net } from "electron";
import { existsSync, mkdirSync, promises, readFile, writeFile } from "fs";
import path from "path";
import { Operation } from "./Operation.js";
import { promisify } from "util";
import { IOperationQueue } from "../interfaces/IOperationQueue.js";
import { TypeOperations } from "../enums/TypeOperation.js";
import { UserData } from "./DirectoryUserData.js";
import { TypeStatusSync } from "../enums/TypeSync.js";


export class DirectoryLO{

    //TODO: Сделать хеш-мапу для операций. То есть, если допустим была операция добавления и затем удаления
    // одной и той же заметки в целях экономии ресурсов, будет менять её состояние, а не сначала делать операцию по сохранению, 
    // а затем удаления

    private userPath: string = app.getPath("userData");

    private folderPath: string = path.join(this.userPath, "ListOperaion");

    private filePath: string = " ";

    private timer: NodeJS.Timeout | null = null;

    private isStatusSend: boolean = false;

    private statusSync: string = TypeStatusSync.True;

    //todo: Сделать проверку на подключение к серверу через ping get запрос

    private operationQueue: IOperationQueue = {
        [TypeOperations.POST]: [],
        [TypeOperations.PUT]: [],
        [TypeOperations.DELETE]: []
    };

    private readFileAsync = promisify(readFile);

    private writeFileAsync = promisify(writeFile);

    private handleFetchData = async (operation: Operation) => {
       try {
         const res = await net.fetch("https://pagtion.vercel.app/api/remoteSync", {
                method: operation.typeOperation,
                headers: {
                    "Content-Type": "Application/json"
                },
                body: JSON.stringify(operation.note)
            });
            return res.ok;
       } catch {
        const res = new Response(JSON.stringify({error: "Not connect"}), {status: 404});
        return res.ok;
       }
    }

    handleGetSyncStatus = () => {
        return this.statusSync;
    }

    handleSetSyncStatusTrue = () => {
        this.statusSync = TypeStatusSync.True;
    }

    handleSetSyncStatusFalse = () => {
        this.statusSync = TypeStatusSync.False;
    }

    handleSetSyncStatusError = () => {
        this.statusSync = TypeStatusSync.Error;
    }

    handlSetFilePath = (userId: string) => {
        const fileName: string = userId;
        this.filePath = `${this.folderPath}/${fileName}.json`;
    }

    //Метод для создания файла очереди операций
    async createListOpearionFile(userId: string){

        const fileName: string = userId;

        console.log("fileName: ", fileName);

        this.filePath = `${this.folderPath}/${fileName}.json`;
        
        // console.log("Method work and create list for queue!");
        if(!existsSync(this.folderPath)){
            mkdirSync(this.folderPath, {recursive: true});
        }

        try {
            if(!existsSync(this.filePath)){
                await this.writeFileAsync(this.filePath, JSON.stringify(this.operationQueue));
            }
        } catch {
            throw new Error("Error create queue list for this user!");
        }
    }

    //Метод для записи операции в файл и очередь
    async writeOperationFile(operation: Operation){
        // console.log("this.filePath write-opration: ", this.filePath);
        try {
            await this.readOpeartionFile();
        } catch (e) {
            console.warn("Could not read operation file before writing, using current queue.", e);
        }

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
        // console.log("this.filePath read-opration: ", this.filePath);
        try {
            const data = await this.readFileAsync(this.filePath, "utf-8");
            const parseData = JSON.parse(data);
            this.operationQueue = parseData;
        } catch {
            throw new Error("Read file async");
        }
    }

    //Метод для отправки операций
    private async sendOperationLoop(){
        if(this.isStatusSend){
            await this.readOpeartionFile();
            for(const typeOp of [TypeOperations.POST, TypeOperations.PUT, TypeOperations.DELETE]){
                // console.log("send typeOp: ", typeOp);
                // console.log("length: ", this.operationQueue[typeOp]);
                while(this.operationQueue[typeOp].length){
                    this.handleSetSyncStatusFalse();
                    // console.log("length-before: ", this.operationQueue[typeOp]);
                    const op = this.operationQueue[typeOp].shift();
                    // console.log("op-:", op);
                    if(op){
                        const res = await this.handleFetchData(op);
                        if(!res){
                            // console.log("res-unshift: ", res);
                            this.operationQueue[typeOp].unshift(op);
                            this.handleSetSyncStatusError();
                            return;
                        }
                        this.handleSetSyncStatusTrue();
                        const body = JSON.stringify(this.operationQueue);
                        await this.writeFileAsync(this.filePath, body, { encoding: "utf-8" });
                    }
                }
            }
        }
        
        this.timer = setTimeout(async () => await this.sendOperationLoop(), 5000);
    }

    async startSendOperation() {
        this.isStatusSend = true;
        // console.log("start send operation");
        await this.sendOperationLoop();
    }

    stopSendOperation() {
        this.isStatusSend = false;
        // console.log("end send operation");
        if(this.timer){
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
}

export const directoryLO = new DirectoryLO();