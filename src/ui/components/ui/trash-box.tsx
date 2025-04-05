import { INote } from "@/interfaces/INote";
import ConfirmModal from "../modals/confirm-modal";
import Spinner from "./spinner";
import { Input } from "@/components/ui/input";

import { Search, Trash, Undo } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

//import useRefreshStore from "@/hooks/use-refresh";

interface IUser {
    id: string,
    email: string,
    name: string,
    image: string | null
}

export default function TrashBox(){

    const navigate = useNavigate();

    const getUser = localStorage.getItem("user");

    const user: IUser = JSON.parse(getUser as string);

    const params = useParams();

    const [search, setSearch] = useState("");

    const [documents, setDocuments] = useState<INote[]>([]);

    //const triggerRefresh = useRefreshStore((state) => state.triggerRefresh);

    const [updateTrash, setUpdateTrash] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            //@ts-ignore
            const data = await window.electronAPI.trashNote(user.id);
            setDocuments(data);
        }
        fetchData();
    }, [updateTrash]);

    const filtredDocuments = documents.filter((document: INote) => {
        return document._title.toLowerCase().includes(search.toLowerCase());
    });

    function onClick(documentId: string){
        navigate(`/documents/${documentId}`);
    }

    function onRestore(event: React.MouseEvent<HTMLDivElement, MouseEvent>, documentId: string){
        debugger
        event.stopPropagation();

        //@ts-ignore
        const promise = window.electronAPI.restore(documentId, user.id);

        toast.promise(promise, {
            loading: "Восстановление заметки...",
            success: "Заметка была успешно восстановлена!",
            error: "Ошибка восставновление заметки"
        });
        //triggerRefresh();
        setUpdateTrash((prev) => !prev);
    }


    function onRemove(documentId: string){
        //@ts-ignore
        const promise = window.electronAPI.deleteNotes(documentId);

        toast.promise(promise, {
            loading: "Удаление заметки...",
            success: "Удаление произошло успешно!",
            error: "Ошибка удаления заметки"
        });
        setUpdateTrash((prev) => !prev);
        if(params.documentId === documentId){
            navigate("/document")
        }
    }

    if(documents === undefined){
        return(
            <div className="h-full border flex items-center justify-center p-4">
                <Spinner size="lg"/>
            </div>
        );
    }

    return(
        <div className="text-sm border ml-1 bg-secondary">
            <div className="flex items-center gap-x-1 p-2">
                <Search className="h-4 w-4"/>
                <Input value={search} onChange={(e) => setSearch(e.target.value)} className="h-7 px-2 focus-visible:ring-transparent bg-secondary" placeholder="Поиск по наимнованию страницы" />
            </div>
            <div className="mt-2 px-1 pb-1">
                <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
                    Страницы не были найдены
                </p>
                {filtredDocuments?.map((document: INote) => (
                    <div key={document._noteId} role = "button" onClick={() => onClick(document._noteId)} className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between">
                        <span className="truncate pl-2">
                            {document._title}
                        </span>
                        <div className="flex items-center">
                            <div onClick={(e) => onRestore(e, document._noteId)} role="button" className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600">
                                <Undo className="w-4 h-4 text-muted-foreground"/>
                            </div>
                            <ConfirmModal onConfirm={() => onRemove(document._noteId)}>
                                <div role="button" className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600">
                                    <Trash className="h-4 w-4 text-muted-foreground"/>
                                </div>
                            </ConfirmModal>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}