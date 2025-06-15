import { GetUser } from "@/actions/user";
import { Button } from "@/components/ui/button";
import useRefreshStore from "@/hooks/use-refresh";
import { INote } from "@/interfaces/INote";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface IUser {
    id: string,
    email: string,
    name: string,
    image: string | null
}

export default function StartDocumentPage() {

    const navigate = useNavigate();

    const { triggerRefresh } = useRefreshStore();

    const user: IUser = GetUser();

    async function onCreate(){
        if(!user){
            throw new Error("Не найден id пользователя!");
        }
        debugger
        //@ts-ignore
        const newNote = window.electronAPI.createNote("Untitled", user.id, undefined).then((item) => {
            const result: INote = item
            triggerRefresh();
            navigate(`/document/${result.id}`);
        });

        toast.promise(newNote, {
            loading: "Создание новой заметки...",
            success: "Новая заметка создана",
            error: "Ошибка создания новой заметки"
        });
    }

    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <h2 className="text-lg font-medium">Добро пожаловать {user.name}!</h2>
            <Button onClick={onCreate}>
                <PlusCircle className="h-4 w-4 mr-2"/>Создать заметку
            </Button>
        </div>
    );
}