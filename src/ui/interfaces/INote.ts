export interface INote{
    userId: string;
    id: string;
    content: string;
    title: string;
    isArchived: boolean; 
    parentDocumentId: string | undefined;
    coverImage: string | undefined;
    icon: string | undefined; 
    isPublished: boolean; 
    creationTime: Number;
}