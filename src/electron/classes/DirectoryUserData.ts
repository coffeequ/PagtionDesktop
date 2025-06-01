import { app, net } from "electron";
import { IUser } from "../interfaces/IUser.js";
import path from "path";
import { existsSync, mkdirSync, readFile, writeFile } from "fs";
import { promisify } from "util";

export class UserData implements IUser{
    id: string = "";
    email: string = "";
    name: string = "";
    image: string | null = "";

    private userPath: string = app.getPath("userData");
    
    private folderPath: string = path.join(this.userPath, "UserInfo");

    private fileName: string = "userData";

    private readFileAsync = promisify(readFile);

    private writeFileAsync = promisify(writeFile);

    private filePath = `${this.folderPath}/${this.fileName}.json`;

    async saveUserFile(user: IUser){
        if(!existsSync(this.folderPath)){
            mkdirSync(this.folderPath, { recursive: true })
        }

        const userSer = {
            id: user.id
        };

        const body = JSON.stringify(userSer);

        try {
            this.writeFileAsync(this.filePath, body);
            return user;
        } catch {
            throw new Error("Error save user data");
        }
    }

    async readUserFile(): Promise<UserData | undefined> { 
        try {
            const raw = await this.readFileAsync(this.filePath, "utf-8");
            const userData: UserData = JSON.parse(raw);
            return userData;
        } catch {
            return undefined
        }
    }
}