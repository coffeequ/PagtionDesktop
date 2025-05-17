import { Note } from "./Note.js";

export class Operation{
    
    typeOperation: "DELETE" | "PUT" | "POST";

    data: string | undefined;

    dateAt: Date;

    note: Note;

    constructor(typeOperation: "DELETE" | "PUT" | "POST", note: Note, dateAt: Date) {
        this.typeOperation = typeOperation;
        this.note = note;
        this.dateAt = dateAt;
    }
}