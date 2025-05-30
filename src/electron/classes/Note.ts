import { v4 as uuidv4 } from "uuid"

export class Note{

    constructor(title: string, userId: string, parentDocumentId?: string) {
        this.id = uuidv4();
        this.userId = userId;
        this.title = title;
        this.parentDocumentId = parentDocumentId;
    }

    userId: string;

    id: string;

    content: string | undefined = "";

    title: string | undefined = "";

    isArchived: boolean = false;

    parentDocumentId: string | undefined = "";

    icon: string | undefined;

    coverImage: string | undefined;
    
    isPublished: boolean | undefined = false;

    creationTime : Number = Date.now();
}