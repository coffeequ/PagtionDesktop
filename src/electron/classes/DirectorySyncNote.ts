import { app } from "electron";
import path from "path";
import { Note } from "./Note.js";


export class DirectoryNotes{
    
    private userPath: string = app.getPath("userData");

    private folderPath: string = path.join(this.userPath, "Notes");

    public hashNotes = new Map();

    GetFolderNotePath(): string {
      return this.folderPath;
    }

    private GetHashNotes(){
        
    }
    
    public ExistsNoteLocale(notes: Note[]){
        notes.forEach((item) => {

        });
    }
}