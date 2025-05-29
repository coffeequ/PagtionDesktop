import { app, net } from "electron";
import { IUser } from "../interfaces/IUser.js";
import path from "path";
import { existsSync, mkdirSync, readFile, writeFile } from "fs";
import { promisify } from "util";
import { DirectorySyncNote } from "./DirectorySyncNote.js";
import { Note } from "./Note.js";


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

    private directorySyncNote: DirectorySyncNote = new DirectorySyncNote();

    async saveUserFile(user: IUser){
        if(!existsSync(this.folderPath)){
            mkdirSync(this.folderPath, { recursive: true })
        }
        const body = JSON.stringify({
            id: user.id
        });

        try {
            this.writeFileAsync(this.filePath, body);
        } catch {
            throw new Error("Error save user data");
        }
    }

    async readUserFile(): Promise<UserData | undefined> { 
        const raw = await this.readFileAsync(this.filePath, "utf-8");
        const userData: UserData = JSON.parse(raw);
        return userData;
    }
}