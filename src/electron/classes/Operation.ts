export class Operation{
    
    typeOperation: "DEL" | "PUT" | "POST";

    noteId: string;

    userId: string;

    data: string | undefined;

    dateAt: Date;

    constructor(typeOperation: "DEL" | "PUT" | "POST", noteId: string, userId: string, data: string | undefined, dateAt: Date) {
        this.typeOperation = typeOperation;
        this.noteId = noteId;
        this.userId = userId;
        this.data = data;
        this.dateAt = dateAt;
    }
}