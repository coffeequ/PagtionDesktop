import { app } from "electron";
import { existsSync, mkdirSync, promises, readFile, unlink, writeFile } from "fs";
import path from "path";
import { Note } from "./Note.js";
import { IUpdateProps } from "../interfaces/IUpdateNote.js";
import { Operation } from "./Operation.js";
import { TypeOperations } from "../enums/TypeOperation.js";

import { directoryLO } from '../classes/ListOperation.js';

export class DirectoryNotes{
    
    private userPath: string = app.getPath("userData");

    private folderPath: string = path.join(this.userPath, "Notes");

    private _notes : Note[] = [];

    public get notes() : Note[] {
      return this._notes;
    }

    public set notes(v : Note[]) {
      this._notes = v;
    }

    public hashNotes = new Map();

    private listOP = directoryLO;

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

    public GetHashNote(){
      return new Map(this.hashNotes);
    }

    GetFolderNotePath(): string {
      return this.folderPath;
    }

    GetFilesNotePath(): string {
      return this.folderPath;
    }

    async readNotesDirectory(){
      if(!existsSync(this.folderPath)){
        mkdirSync(this.folderPath, { recursive: true });
      }
      const files = await promises.readdir(this.folderPath);
      const promiseFiles = files.map(async (item) => {
        const filePath = path.join(this.folderPath, item);
        const data = await this.readFilePromise(filePath);
        return JSON.parse(data);
      });
      const notes: Note[] = await Promise.all(promiseFiles);
      this.notes = notes;
      this.notes.forEach((item) => {
        this.hashNotes.set(item.id, item);
      });
    }
      
    async createNotesDirectory(note: Note): Promise<Note> {
      this.listOP.handlSetFilePath(note.userId);
      return new Promise((resolve, reject) => {
        const filePath = `${this.folderPath}/${note.id}.json`;
        writeFile(filePath, JSON.stringify(note), (err) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            //console.log("createNote: ", note);
            this.notes.push(note);
            this.listOP.writeOperationFile(new Operation(note, TypeOperations.POST));
            this.hashNotes.set(note.id, note);
            resolve(note);
          }
        });
      });
    }
    
      
    async deleteNoteDirectory(noteId: string): Promise<Note>{
       return new Promise((resolve, rejects) => {
        unlink(`${this.folderPath}/${noteId}.json`, (err) => {
          if(err){
            rejects(err);
          }
          else {
            const indexDelete = this.notes.findIndex((item) => item.id === noteId);
            // console.log("indexDelete: ", indexDelete);
            if(indexDelete === -1){
              throw new Error(`Ошибка удаления. Заметка не была найдена`);
            }
            const [deleteNote] = this.notes.splice(indexDelete, 1); 
            // console.log("Delete note: ", [deleteNote]);
            this.listOP.writeOperationFile(new Operation(deleteNote, TypeOperations.DELETE));
            this.hashNotes.delete(deleteNote.id);
            resolve(deleteNote);
          }
        });
       })
    }
      
    async editNoteDirectory(note : IUpdateProps): Promise<IUpdateProps> {
      return new Promise((resolve, rejects) => {
        writeFile(`${this.folderPath}/${note.id}.json`, JSON.stringify(note), (err) => {
          if(err){
            rejects(err);
          }
          else {
            resolve(note);
          }
        });
      })
  }

  async restoreNote(noteId: string){
    if(this.hashNotes.has(noteId)){
      const note: Note = this.hashNotes.get(noteId);
      const parentNote: Note = this.hashNotes.get(note.parentDocumentId); 
      if(parentNote && parentNote.isArchived){
        note.parentDocumentId = undefined;
      }
      note.isArchived = false;
      await this.updateNotes(note);
      for(const item of this.notes){
        if(item.parentDocumentId === noteId){
          await this.restoreNote(item.id);
        }
      }
    }
    else{
      throw new Error("Ошибка архивации документа");
    }
  }
  
    async archivedNote(noteId: string){
      if(this.hashNotes.has(noteId)){
        const note: Note = this.hashNotes.get(noteId);
        note.isArchived = true;
        this.updateNotes(note);
        for(const item of this.notes){
          if(item.parentDocumentId === noteId){
            await this.archivedNote(item.id);
          }
        }
      }
      else{
        throw new Error("Ошибка архивации документа");
      }
    }
    
    async sidebar(userId: string, parentDocumentId: string){
      const resultArr = [];
      for (let i = 0; i < this.notes.length; i++) {
        if(this.notes[i].isArchived === false && this.notes[i].userId === userId && (this.notes[i].parentDocumentId === parentDocumentId || this.notes[i].parentDocumentId === null)){
          resultArr.push(this.notes[i]);
        }
      }
      return resultArr;
    }

    async getIdNotes(noteId: string){
      return this.hashNotes.get(noteId);
    }

    async updateNotes({ id, title, content, isPublished, icon, coverImage}: IUpdateProps){
      if(this.hashNotes.has(id)){
        this.listOP.handleSetSyncStatusFalse();
        const item: IUpdateProps = this.hashNotes.get(id);
        if(title !== undefined) item.title = title;
        if(content !== undefined) item.content = content;
        if(icon !== undefined) item.icon = icon;
        if(coverImage !== undefined) item.coverImage = coverImage;
        item.isPublished = isPublished;
        await this.editNoteDirectory(item);
        this.listOP.writeOperationFile(new Operation(item as Note, TypeOperations.PUT));
        return;
      }
      else{
        this.notes.find(async (item) => {
          if(item.id === id){
            this.hashNotes.set(id, item);
            await this.updateNotes(item);
            return;
          }
        })
      }
    }

    async trashNote(userId: string){
      const trash: Note[] = [];
      // console.log("notes: ", this.notes);
      this.notes.forEach((item) => {
        if(item.isArchived === true && item.userId === userId){
          trash.push(item);
        }
      })
      // console.log("trash: ", trash);
      return trash;
    }

    async searchNote(userId: string){
     const resultArr: Note[] = [];
     for(let i = 0; i < this.notes.length; i++){
      if(!this.notes[i].isArchived && this.notes[i].userId === userId){
        resultArr.push(this.notes[i]);
      }
     }
     return resultArr.filter((item) => item.title);
    }

    async existsNote(notesFromBrowser: Note[]){
      notesFromBrowser.forEach((item) => {
        this.hashNotes.has(item.id)
      })
    }
}