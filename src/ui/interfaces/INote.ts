export interface INote{
    userId: string;
    noteId : string;
    content: string;
    title: string;
    isArchived: boolean; 
    parentDocumentId : string | undefined;
    coverImage : string;
    icon : string | undefined; 
    isPublished : boolean; 
    creationTime: Number;
}