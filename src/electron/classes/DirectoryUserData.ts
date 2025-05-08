import { app } from "electron";
import { IUser } from "../interfaces/IUser.js";
import path from "path";
import { existsSync, mkdirSync, readFile, writeFile } from "fs";


export class UserData{
    id: string | undefined;
    email: string | undefined;
    name: string | undefined;
    image: string | undefined;

    private userPath: string = app.getPath("userData");
    
    private folderPath: string = path.join(this.userPath, "UserInfo");

    private fileName: string = "userData";

    private readFilePromise(filePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            readFile(filePath, "utf-8", (err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    }

    async saveUserFile(user: IUser): Promise<boolean>{
        if(!existsSync(this.folderPath)){
            mkdirSync(this.folderPath, { recursive: true })
        }
        
        return new Promise((resolve, reject) => {
            const filePath = `${this.folderPath}/${this.fileName}.json`;
            writeFile(filePath, JSON.stringify({
                id: user.id,
            }), (err) => {
                if(err){
                    reject(false);
                } else {
                    resolve(true)
                }
            })
        })
    }

    async readUserFile(): Promise<UserData | undefined> { 
        const promiseFiles = async () => {
            const filePath = `${this.folderPath}/${this.fileName}.json`;
            const data = await this.readFilePromise(filePath);
            return JSON.parse(data);
        };

        const user: UserData = await promiseFiles();
        
        if(!user){
            return undefined;
        }
        return user;
    }
}