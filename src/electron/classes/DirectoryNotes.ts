import { app, Net, net } from "electron";
import { existsSync, mkdirSync, promises, readFile, unlink, writeFile } from "fs";
import path from "path";
import { Note } from "./Note.js";
import { IUpdateProps } from "../interfaces/IUpdateNote.js";

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

    updateMap = new Map();

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
        this.updateMap.set(item.noteId, item);
      });
    }
      
    async createNotesDirectory(note: Note): Promise<Note> {
      return new Promise((resolve, reject) => {
        const filePath = `${this.folderPath}/${note.noteId}.json`;
        writeFile(filePath, JSON.stringify(note), (err) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            //console.log("createNote: ", note);
            this.notes.push(note);
            this.updateMap.set(note.noteId, note);
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
            const indexDelete = this.notes.findIndex((item) => item.noteId === noteId);
            console.log("indexDelete: ", indexDelete);
            if(indexDelete === -1){
              throw new Error(`Ошибка удаления. Заметка не была найдена`);
            }
            const [deleteNote] = this.notes.splice(indexDelete, 1); 
            console.log("Delete note: ", [deleteNote]);
            this.updateMap.delete(deleteNote.noteId);
            resolve(deleteNote);
          }
        });
       })
    }
      
    async editNoteDirectory(note : IUpdateProps): Promise<IUpdateProps> {
      return new Promise((resolve, rejects) => {
        writeFile(`${this.folderPath}/${note.noteId}.json`, JSON.stringify(note), (err) => {
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
    if(this.updateMap.has(noteId)){
      const note: Note = this.updateMap.get(noteId);
      const parentNote: Note = this.updateMap.get(note.parentDocumentId); 
      if(parentNote && parentNote.isArchived){
        note.parentDocumentId = undefined;
      }
      note.isArchived = false;
      await this.updateNotes(note);
      for(const item of this.notes){
        if(item.parentDocumentId === noteId){
          await this.restoreNote(item.noteId);
        }
      }
    }
    else{
      throw new Error("Ошибка архивации документа");
    }
  }

    // async recursiveArchivedNote(noteId: string) {
    //   this.notes.forEach((item) => {
    //     if(item.noteId === noteId){
    //       item.isArchived = true;
    //       return;
    //     }
    //   });
    //   this.notes.forEach((item) => {
    //     if(item.parentDocumentId === noteId){
    //       this.recursiveArchivedNote(item.parentDocumentId);
    //     }
    //     return;
    //   }) 
    // }

    // async archivedNote(noteId: string){
    //   if(this.updateMap.has(noteId)){
    //     const note: Note = this.updateMap.get(noteId);
    //     note.isArchived = true;
    //     if(note.parentDocumentId === undefined || note.parentDocumentId === null){
    //       return;
    //     }
    //     this.notes.forEach(async (item) => {
    //       if(note.parentDocumentId !== undefined || note.parentDocumentId !== null){
    //         item.isArchived = true;
    //         await this.archivedNote(item.noteId);
    //       }
    //     });
    //   }
    // }

    // async archivedNote(noteId: string){
    //   if(this.updateMap.has(noteId)){
    //     const note: Note = this.updateMap.get(noteId);
    //     note.isArchived = true;
    //     if(note.parentDocumentId === undefined){
    //       return;
    //     }
    //     else{
    //       this.notes.forEach(async (item) => {
    //         if(item.parentDocumentId === noteId)
    //         await this.archivedNote(item.noteId);
    //       })
    //     }
    //   }
    // }

    async archivedNote(noteId: string){
      if(this.updateMap.has(noteId)){
        const note: Note = this.updateMap.get(noteId);
        note.isArchived = true;
        this.updateNotes(note);
        for(const item of this.notes){
          if(item.parentDocumentId === noteId){
            await this.archivedNote(item.noteId);
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
      return this.updateMap.get(noteId);
    }

    async updateNotes({ noteId, title, content, isPublished }: IUpdateProps){
      if(this.updateMap.has(noteId)){
        const item: IUpdateProps = this.updateMap.get(noteId);
        if(title !== undefined) item.title = title;
        if(content !== undefined) item.content = content;
        item.isPublished = isPublished;
        await this.editNoteDirectory(item);
        return;
      }
      else{
        this.notes.find(async (item) => {
          if(item.noteId === noteId){
            this.updateMap.set(noteId, item);
            await this.updateNotes(item);
            return;
          }
        })
      }
    }

    async trashNote(userId: string){
      const trash: Note[] = [];
      console.log("notes: ", this.notes);
      this.notes.forEach((item) => {
        if(item.isArchived === true && item.userId === userId){
          trash.push(item);
        }
      })
      console.log("trash: ", trash);
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
}