import { useSearch } from "@/hooks/use-search";
import { useEffect, useState } from "react";
import { File } from "lucide-react";
import { DialogTitle } from "./dialog"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command"
import { useNavigate } from "react-router-dom";
import { GetUser } from "@/actions/user";
import { INote } from "@/interfaces/INote";

export default function SearchCommand(){
    
    const navigate = useNavigate();

    const userId = GetUser();

    const [isMounted, setIsMounted] = useState(false);

    const [documents, setDocuments] = useState<INote[]>([]);

    const toggle = useSearch((store) => store.toggle);

    const isOpen = useSearch((store) => store.isOpen);

    const onClose = useSearch((store) => store.onClose);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        async function fetchDocument(){
            if(!userId){
                throw new Error("Не найден id пользователя");
            }
            //@ts-ignore
            const data = await window.electronAPI.searchNote(userId.id)
            //console.log(data);
            setDocuments(data);
        }
        
        fetchDocument();
    }, [isOpen]);

    useEffect(() => {
        const down = (e: KeyboardEvent) =>{
            if(e.key === 'k' || e.key==="л" && (e.metaKey || e.ctrlKey)){
                e.preventDefault();
                toggle();
            }
        }

        document.addEventListener("keydown", down);
        return () => {
            document.removeEventListener("keydown", down);
        }
    }, [toggle]);

    function onSelect(id: string): void {
        //console.log(id);
        const idDocument = id.indexOf(" - ");
        if(idDocument < 0){
            navigate("/document/startPage");
            throw new Error("Ошибка...");
        }
        const resultDoumentId = id.slice(0, idDocument);
        //console.log(resultDoumentId);
        navigate(`/document/${resultDoumentId}`);
        onClose();
    }
    
    if(!isMounted){
        return null;
    }

    return(
        <CommandDialog open = {isOpen} onOpenChange={onClose}>
            <CommandInput/>
            <CommandList>
                <CommandEmpty>Не было найдено результатов</CommandEmpty>
                <DialogTitle></DialogTitle>
                <CommandGroup heading="Заметки">
                {
                        documents?.map((document) => (
                            // value={`${document._id} - ${document.title}`}
                            <CommandItem key = {document.noteId} value={`${document.noteId} - ${document.title}`} title={document.title} onSelect={onSelect}>
                                {
                                    document.icon ? (
                                        <p className="mr-2 text-[18px]">
                                            {document.icon}
                                        </p>
                                    ): (
                                        <File className="mr-2 h-4 w-4"></File>
                                    )
                                }
                                <span>
                                    {document.title}
                                </span>
                            </CommandItem>
                        ))
                    }
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}