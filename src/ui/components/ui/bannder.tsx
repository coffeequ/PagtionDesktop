import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import useRefreshStore from "@/hooks/use-refresh";
import { useNavigate } from "react-router-dom";
import { GetUser } from "@/actions/user";

interface IBannerProps{
    documentId: string
}

export default function Banner({documentId}: IBannerProps){

    const navigate = useNavigate();

    const user = GetUser();

    const triggerRefresh = useRefreshStore((state) => state.triggerRefresh);

    function onRemove(){
        
        //@ts-ignore
        const promise = window.electronAPI.deleteNotes(documentId); 

        toast.promise(promise, {
            loading: "Удаление заметки...",
            success: "Удаление произошло успешно!",
            error: "Произошла ошибка при удалении."
        });

        navigate("/document/startPage");
    }

    function onRestore(){
        if(!user.id) return;

        //@ts-ignore
        const promise = window.electronAPI.restore(documentId).then((item) => {
            triggerRefresh();
            navigate("/document/startPage");
        });

        toast.promise(promise, {
            loading: "Восстановление заметки...",
            success: "Восстановление произошло успешно!",
            error: "Произошла ошибка при восстановлении."
        });
    }

    return(
        <>
            <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center mb-2">
                <p>
                    Страница находится в корзине.
                </p>
                <Button onClick={onRestore} variant="outline" className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal">
                    Восстановить страницу
                </Button>
                <ConfirmModal onConfirm={onRemove}>
                    <Button variant="outline" className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal">
                        Удалить страницу
                    </Button>
                </ConfirmModal>
            </div>
        </>
    );
}