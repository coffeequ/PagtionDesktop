import { app, net } from "electron";
import path from "path";
import { Note } from "./Note.js";
import { writeFile } from "fs";


export class DirectorySyncNote{
    
  private userPath: string = app.getPath("userData");

  private folderPath: string = path.join(this.userPath, "Notes");

  private statusWeb: boolean = false;

  GetFolderNotePath(): string {
    return this.folderPath;
  }
    
  public async ExistsNoteLocale(notes: Note[]){
    // console.log("Метод сработал. Все полученные заметки:", notes);
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
    try {
        const res = await net.fetch("https://pagtion.vercel.app/api/getNote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
          body: JSON.stringify({id})
        })
        
        return res;
      } catch {
        return new Response(JSON.stringify({error: "Error connect"}), {status: 404});
      }
  }
  
}