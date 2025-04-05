import { useEffect, useState } from "react";
import Item from "./Item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";
import { GetUser } from "@/actions/user";

import useRefreshStore from "@/hooks/use-refresh";
import { INote } from "@/interfaces/INote";

interface DocumentListProps{
    parentDocumentId?: string;
    level?: number;
}

export default function DocumentList({ parentDocumentId, level = 0} : DocumentListProps) {

    const shouldRefresh = useRefreshStore((state) => state.shouldRefresh);

    const navigate = useNavigate();

    const params = useParams();

    const user = GetUser();

    const [documents, setDocuments] = useState<INote[]>([]);

    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    function onExpand(documentId: string){
        setExpanded(prevExpanded => ({
            ...prevExpanded,
            [documentId]: !prevExpanded[documentId]
        }));
    }

    const fetchDocuments = async () => {
        if(!user){
            throw new Error("Пользователь не был найден!");
        }
        //@ts-ignore
        const data: INote[] = await window.electronAPI.sidebar(user.id, parentDocumentId);
        setDocuments(data);
    }

    useEffect(() => {
        fetchDocuments();
    }, [parentDocumentId, shouldRefresh]);

    function refreshDocuments(){
        fetchDocuments();
    } 

    function onRedirect(documentId: string){
        navigate(`/documents/${documentId}`);
    }

    if (documents === undefined){
        return(
            <>
                <Item.Skeleton level = {level}/>
                {level === 0} && (
                    <>
                        <Item.Skeleton level={level}/>
                        <Item.Skeleton level={level}/>
                    </>
                )
            </>
        )
    }
    
    return(
        <>
            <p
            style = {{
                paddingLeft: level ? `${(level * 12) + 25}px` : undefined
            }}
            //3:32:59
            className={cn("hidden text-sm font-medium text-muted-foreground/80", expanded && "last:block", level === 0 && "hidden")}>
                Нет вложенных страниц
            </p>
            {documents.map((document) => (
                <div key={document._noteId}>
                        <Item id={document._noteId}
                        onClick={() => onRedirect(document._noteId)}
                        label = {document._noteId}
                        icon = {FileIcon}
                        documentIcon={document._noteId!}
                        active = {params.documentId === document._noteId}
                        level = {level}
                        onExpand={() => onExpand(document._noteId)}
                        expanded = {expanded[document._noteId]}
                        refreshDocuments={refreshDocuments}
                        />
                        {
                            
                            expanded[document._noteId as string] && (
                                <DocumentList
                                    parentDocumentId={document._noteId}
                                    level={level + 1}
                                />
                            )
                        }
                </div>
            ))}
        </>
    );
}

