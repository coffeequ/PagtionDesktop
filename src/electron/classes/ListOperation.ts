import { app, net } from "electron";
import { existsSync, mkdirSync, readFile, writeFile } from "fs";
import path from "path";
import { Operation } from "./Operation.js";
import { promisify } from "util";
import { IOperationQueue } from "../interfaces/IOperationQueue.js";
import { TypeOperations } from "../enums/TypeOperation.js";
import { TypeStatusSync } from "../enums/TypeSync.js";
import { rm } from "fs/promises";


export class DirectoryLO{

    //TODO: Сделать хеш-мапу для операций. То есть, если допустим была операция добавления и затем удаления
    // одной и той же заметки в целях экономии ресурсов, будет менять её состояние, а не сначала делать операцию по сохранению, 
    // а затем удаления

    private userPath: string = app.getPath("userData");

    private folderPath: string = path.join(this.userPath, "ListOperation");

    filePath: string = " ";

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


    handleGetSendStatus = () => {
        return this.isStatusSend;
    }

    handleSetSendStatus = (state: boolean) => {
        return this.isStatusSend = state;
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

        this.filePath = `${this.folderPath}/${fileName}.json`;

        console.log("this.filePath", this.filePath);
        
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

        async CheckIncludeInfo(userId: string){

        const fileName: string = userId;

        this.filePath = `${this.folderPath}/${fileName}.json`;

         try {
            const data = await this.readFileAsync(this.filePath, "utf-8");
            const parseData = JSON.parse(data);
            this.operationQueue = parseData;
        } catch {
            await this.createListOpearionFile(userId);
        }

    }

    //Метод для записи операции в файл и очередь
    async writeOperationFile(operation: Operation){
        try {
            await this.readOpeartionFile();
        } catch (e) {
            throw new Error("Read operations file!");
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
        try {
            const data = await this.readFileAsync(this.filePath, "utf-8");
            const parseData = JSON.parse(data);
            this.operationQueue = parseData;
        } catch {
            throw new Error("Read file async");
        }
    }

    //Метод для отправки операций
    //Попрбовать исправить как-нибудь case при котором заметки нет на сервере, но она есть на клиенте
    private async sendOperationLoop(){
        if(this.isStatusSend){
            await this.readOpeartionFile();
            for(const typeOp of [TypeOperations.POST, TypeOperations.PUT, TypeOperations.DELETE]){
                while(this.operationQueue[typeOp].length){
                    this.handleSetSyncStatusFalse();
                    const op = this.operationQueue[typeOp].shift();
                    if(op){
                        const res = await this.handleFetchData(op);
                        if(!res){
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

    async startSendOperation(userId: string) {
        this.isStatusSend = true;
        await this.CheckIncludeInfo(userId);
        await this.sendOperationLoop();
    }

    stopSendOperation() {
        this.isStatusSend = false;
        if(this.timer){
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    async deleteListOperation(){
      if(existsSync(this.folderPath)){
        try {
          await rm(this.folderPath, {recursive: true, force: true});
        } catch (error) {
          throw error;
        }
      }
    }
}

export const directoryLO = new DirectoryLO();