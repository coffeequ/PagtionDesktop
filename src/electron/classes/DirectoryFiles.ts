import path from "path";
import os from "os"
import { existsSync, mkdirSync, promises, writeFile } from "fs";
import { IFilesUpload } from "../interfaces/IFilesUpload.js";

export class DirectoryFile{

    private filesFolderPath = path.join(os.homedir(), "FilesNotes");

    private index: number = 1;

    filesNameMap = new Map();

    GetFolderFilesPath(){
        return this.filesFolderPath;
    }
    
    createFolder(): void {
        if(!existsSync(this.filesFolderPath)){
            mkdirSync(this.filesFolderPath, { recursive: true });
        }
    }

    async readNameFiles() {
        const files = await promises.readdir(this.filesFolderPath);
        files.forEach((item) => {
            this.filesNameMap.set(item, "");
        });
        return;
    }

    async handleUpload({ name, arrayBuffer }: IFilesUpload): Promise<string>{
        
        if(this.filesNameMap.has(name)){
            let [editText, format] = name.split(".");
            editText += ` (${this.index})`;
            name = `${editText}.${format}`;
        }

        const fileName = name;

        const filePath = path.join(this.filesFolderPath, fileName);

        const buffer = Buffer.from(arrayBuffer);

        return new Promise((resolve, reject) => {
            writeFile(filePath, buffer, (err) => {
                if(err){
                    reject(err);
                }
                else{
                    this.index++;
                    resolve(`file://${filePath}`);
                }
            })
        })
    }
}