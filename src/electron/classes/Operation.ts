import { TypeOperations } from "../enums/TypeOperation.js";
import { Note } from "./Note.js";

export class Operation{

    typeOperation: TypeOperations;

    dateAt: Date = new Date();

    note: Note;

    constructor(note: Note, typeOperation: TypeOperations) {
        this.typeOperation = typeOperation;
        this.note = note;
    }

}