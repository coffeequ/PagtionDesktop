import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner"
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import useRefreshStore from "@/hooks/use-refresh";
import Navigation from "@/components/ui/navigation";
import { INote } from "@/interfaces/INote";

interface IUser {
    id: string,
    email: string,
    name: string,
    image: string | null
}

export default function DocumentPage(){

    const navigate = useNavigate();

    const { triggerRefresh } = useRefreshStore();

    const getUser = localStorage.getItem("user");

    const user: IUser = JSON.parse(getUser as string);
    
    async function onCreate(){
        if(!user){
            throw new Error("Не найден id пользователя!");
        }

        //Почему-то в консоль браузера выводится undefined
        //@ts-ignore
        const newNote = window.electronAPI.createNote("Untitled", user.id).then((item) => {
            const result: INote = item
            triggerRefresh();
            navigate(`/document/${result._noteId}`);
        });

        toast.promise(newNote, {
            loading: "Создание новой заметки...",
            success: "Новая заметка создана",
            error: "Ошибка создания новой заметки"
        });
    }
    
    return(
        <div className="h-full flex dark:bg-[#1F1F1F]">
        <main className="flex-1 h-full overflow-y-auto">
            {/* <SearchCommand/> */}
            <Navigation/>
            <div className="h-full flex flex-col items-center justify-center space-y-4">
                <h2 className="text-lg font-medium">Добро пожаловать {user.name}!</h2>
                <Button onClick={onCreate}>
                    <PlusCircle className="h-4 w-4 mr-2"/>Создать первую заметку
                </Button>
            </div>
            <Outlet/>
        </main>
    </div>
    );
}