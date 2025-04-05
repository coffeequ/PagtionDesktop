export interface INote{
    _userId: string;
    _noteId : string;
    _content: string;
    _title: string;
    _isArchived: boolean; 
    _parentDocumentId : string | undefined;
    _coverImage : string;
    _icon : string | undefined; 
    _isPublished : boolean; 
    _creationTime: Number;
}