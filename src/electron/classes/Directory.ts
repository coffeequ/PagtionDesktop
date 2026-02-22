import { readFile, unlink, writeFile } from "fs";
import { promisify } from "util";
import { Note } from "./Note.js";
import { IUpdateProps } from "../interfaces/IUpdateNote.js";

export class Directory{
    
    private readFileAsync = promisify(readFile);
    
    private writeFileAsync = promisify(writeFile);

    private unlinkFileAsync = promisify(unlink);

    async writeFileNote(path: string, Note: Note | IUpdateProps){
        try {
            await this.writeFileAsync(path, JSON.stringify(Note));
        } catch (error) {
            throw new Error("Write file error");
        }
    }

    async writeFileFiles(path: string, data: Buffer<ArrayBuffer>){
        try {
            await this.writeFileAsync(path, data);
        } catch (error) {
            throw new Error("Write file error");
        }
    }

    async writeFileObj(path: string, data: string){
        try {
            await this.writeFileAsync(path, data, {encoding: "utf-8"});
        } catch (error) {
            throw new Error("Write file error (obj)");
        }
    }

    async readFile(path: string){
        try {
            return await this.readFileAsync(path, "utf-8");
        } catch (error) {
            throw new Error("read file error");
        }
    }

    async unlinkFile(path: string){
        try {
            return await this.unlinkFileAsync(path);
        } catch (error) {
            throw new Error("read file error");
        }
    }
}