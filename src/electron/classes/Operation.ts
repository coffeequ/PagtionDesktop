import { TypeOperations } from "../enums/TypeOperation.js";
import { Note } from "./Note.js";

export class Operation{

    typeOperation: TypeOperations;

    data: string | undefined;

    dateAt: Date;

    note: Note;

    constructor(note: Note, dateAt: Date, typeOperation: TypeOperations) {
        this.typeOperation = typeOperation;
        this.note = note;
        this.dateAt = dateAt;
    }

}