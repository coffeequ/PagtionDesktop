import { app, net } from "electron";
import path from "path";
import { Note } from "./Note.js";
import { writeFile } from "fs";
import { DirectoryNotes } from "./DirectoryNotes.js";


export class DirectorySyncNote{
    
  private userPath: string = app.getPath("userData");

  private folderPath: string = path.join(this.userPath, "Notes");

  public hashNotes = new Map();

  GetFolderNotePath(): string {
    return this.folderPath;
  }

  SyncHashMap(directoryNotes: DirectoryNotes): void {
    this.hashNotes = directoryNotes.GetHashNote();
  }
    
  public async ExistsNoteLocale(notes: Note[]){
    console.log("Метод сработал. Все полученные заметки:", notes);
    const promiseWrite = notes.map((item) => {
      if(!this.hashNotes.has(item)){
        const filePath = `${this.folderPath}/${item.id}.json`;
          writeFile(filePath, JSON.stringify(item), (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
    });

    await Promise.all(promiseWrite);
  }

  public async fetchPostNote(body: string){
    const res = await net.fetch("http://localhost:3000/api/getNote", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
        body: body
      })
      return await res.json();
  }
  
}