import { app } from "electron";
import { existsSync, mkdirSync, promises, readFile, unlink, writeFile } from "fs";
import path, { resolve } from "path";
import { Note } from "./Note.js";

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
    
    async readNotesDirectory(){
      if(!existsSync(this.folderPath)){
        mkdirSync(this.folderPath, { recursive: true });
        console.log("Folder with notes is create: ", this.folderPath);
      }
      else{
        console.log("folder with notes exists: ", this.folderPath);
      }

      const files = await promises.readdir(this.folderPath);
      const promiseFiles = files.map(async (item) => {
        const filePath = path.join(this.folderPath, item);
        const data = await this.readFilePromise(filePath);
        return JSON.parse(data);
      });
      const notes: Note[] = await Promise.all(promiseFiles);
      this.notes = notes;
    }
      
    async createNotesDirectory(note: Note): Promise<Note> {
      return new Promise((resolve, reject) => {
        const filePath = `${this.folderPath}/${note.noteId}.json`;
        writeFile(filePath, JSON.stringify(note), (err) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log("createNote: ", note);
            this.notes.push(note);
            resolve(note);
          }
        });
      });
    }
    
      
    async deleteNoteDirectory(noteId: string): Promise<Note[]>{
       return new Promise((resolve, rejects) => {
        unlink(`${this.folderPath}/${noteId}.json`, (err) => {
          if(err){
            console.log(err);
            rejects(err);
          }
          else {
            const indexDelete = this.notes.findIndex((item) => item.noteId === noteId);
            const result = this.notes.splice(indexDelete, 1);
            resolve(result);
          }
        });
       })
    }
      
    async editNoteDirectory(note : Note): Promise<Note> {
        return new Promise((resolve, rejects) => {
          const indexDelete = this.notes.findIndex((item) => item.noteId === note.noteId);
          this.notes.splice(indexDelete, 1);
          writeFile(`${this.folderPath}/${note.noteId}.json`, JSON.stringify(note), (err) => {
            if(err){
              console.log(err);
              rejects(err);
            }
            else {
              this.notes.push(note);
              resolve(note);
            }
          });
        })
    }

    async recursiveRestoreNote(noteId: string) {
      this.notes.forEach((item) => {
        if(item.noteId === noteId){
          item.isArchived = false;
        }
      });
      this.notes.forEach((item) => {
        if(item.parentDocumentId === noteId){
          this.recursiveRestoreNote(item.parentDocumentId);
        }
      }) 
    }

    async recursiveArchivedNote(noteId: string) {
      this.notes.forEach((item) => {
        if(item.noteId === noteId){
          item.isArchived = true;
        }
      });
      this.notes.forEach((item) => {
        if(item.parentDocumentId === noteId){
          this.recursiveRestoreNote(item.parentDocumentId);
        }
      }) 
    }
    
    async sidebar(userId: string, parentDocumentId: string){
      const resultArr = [];
      console.log("arr: ", this.notes);
      for (let i = 0; i < this.notes.length; i++) {
        console.log("this notes: ", this.notes[i]);
        console.log("isArchived: ", this.notes[i], "userId: ", this.notes[i].userId, "parentDocumentId: ", this.notes[i].parentDocumentId);
        if(this.notes[i].isArchived === false && this.notes[i].userId === userId && (this.notes[i].parentDocumentId === parentDocumentId || this.notes[i].parentDocumentId === null)){
          resultArr.push(this.notes[i]);
        }
      }
      return resultArr;
    }

    async getIdNotes(noteId: string){
      const note = this.notes.find((item) => {
        if(item.noteId === noteId){
          return true;
        }
        return false;
      })
      return note;
    }

    async updateNotes(noteId: string, isPublished?: boolean, userId?: string, title?: string, content?: string, icon?: string){
      this.notes.forEach((item) => {
        if(item.noteId === noteId){
          item.title = title;
          item.content = content;
          item.icon = icon;
          item.isPublished = isPublished;
        }
      });
      return this.notes;
    }

    async trashNote(userId: string){
      const trash: Note[] = [];
      this.notes.forEach((item) => {
        if(item.isArchived === true && item.userId === userId){
          trash.push(item);
        }
      })

      return trash;
    }
}