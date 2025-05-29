import { app, net } from "electron";
import path from "path";
import { Note } from "./Note.js";
import { writeFile } from "fs";


export class DirectorySyncNote{
    
  private userPath: string = app.getPath("userData");

  private folderPath: string = path.join(this.userPath, "Notes");

  GetFolderNotePath(): string {
    return this.folderPath;
  }
    
  public async ExistsNoteLocale(notes: Note[]){
    console.log("Метод сработал. Все полученные заметки:", notes);
    const promiseWrite = notes.map((item) => {
      const filePath = `${this.folderPath}/${item.id}.json`;
          writeFile(filePath, JSON.stringify(item), (err) => {
          if (err) {
            console.error(err);
          }
        });
    });

    await Promise.all(promiseWrite);
  }

  public async fetchPostNote(id: string): Promise<Response>{
    const res = await net.fetch("http://localhost:3000/api/getNote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
        body: JSON.stringify({id})
      })
      return res;
  }
  
}