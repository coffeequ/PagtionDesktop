import { app, net } from "electron";
import { IUser } from "../interfaces/IUser.js";
import path from "path";
import { existsSync, mkdirSync, readFile, writeFile } from "fs";
import { promisify } from "util";
import { Directory } from "./Directory.js";

export class UserData implements IUser{
    id: string = "";
    email: string = "";
    name: string = "";
    image: string | null = "";

    private userPath: string = app.getPath("userData");
    
    private folderPath: string = path.join(this.userPath, "UserInfo");

    private fileName: string = "userData";

    private filePath = `${this.folderPath}/${this.fileName}.json`;

    directory: Directory = new Directory();

    async saveUserFile(user: IUser){
        if(!existsSync(this.folderPath)){
            mkdirSync(this.folderPath, { recursive: true })
        }

        const userSer = {
            id: user.id
        };

        const body = JSON.stringify(userSer);

        this.directory.writeFileObj(this.filePath, body);
    }

    async readUserFile(): Promise<UserData | undefined> { 
        try {
            const raw = await this.directory.readFile(this.filePath);
            const userData: UserData = JSON.parse(raw);
            return userData;
        } catch {
            return undefined
        }
    }
}