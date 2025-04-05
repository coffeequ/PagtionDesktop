import { v4 as uuidv4 } from "uuid"

export class Note{

    constructor(title: string, userId: string, parentDocumentId?: string) {
        this._noteId = uuidv4();
        this._userId = userId;
        this._title = title;
        this._parentDocumentId = parentDocumentId;
    }

    private _userId: string;

    public get userId(): string{
        return this._userId;
    }

    private _noteId : string;

    public get noteId() : string {
        return this._noteId;
    }

    private _content?: string | undefined;

    public get content(): string | undefined {
        return this._content;
    }

    public set content(value: string | undefined) {
        this._content = value;
    }

    private _title?: string;

    public get title(): string | undefined{
        return this._title;
    }

    public set title(value: string | undefined){
        this._title = value;
    }


    private _isArchived : boolean = false;

    public get isArchived() : boolean {
        return this._isArchived;
    }
    public set isArchived(value : boolean) {
        this._isArchived = value;
    }

    
    private _parentDocumentId? : string;

    public get parentDocumentId() : string | undefined {
        return this._parentDocumentId;
    }
    public set parentDocumentId(value : string | undefined) {
        this._parentDocumentId = value;
    }

    
    private _coverImage : string | undefined = "";

    public get coverImage() : string | undefined {
        return this._coverImage;
    }
    public set coverImage(value : string | undefined) {
        this._coverImage = value;
    }

    private _icon? : string | undefined;

    public get icon() : string | undefined {
        return this._icon;
    }
    public set icon(value : string | undefined) {
        this._icon = value;
    }
    
    
    private _isPublished : boolean | undefined = false;

    public get isPublished() : boolean | undefined {
        return this._isPublished;
    }
    public set isPublished(value : boolean | undefined) {
        this._isPublished = value;
    }

    private _creationTime : Number = Date.now();

    public get creationTime() : Number {
        return this._creationTime;
    }
    public set creationTime(value : Number) {
        this._creationTime = value;
    }
}