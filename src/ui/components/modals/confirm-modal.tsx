import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTrigger, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../ui/alert-dialog";

interface ConfirmModalProps{
    children: React.ReactNode;
    onConfirm: () => void;
}

export default function ConfirmModal({ children, onConfirm }: ConfirmModalProps){
    
    function handlerConfirm(event: React.MouseEvent<HTMLButtonElement>){
        event.stopPropagation();
        onConfirm();
    }

    return(
        <AlertDialog>
            <AlertDialogTrigger onClick={(e) => e.stopPropagation()} asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Вы точно хотите удалить?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Это событие не может быть восстановлено
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={e => e.stopPropagation()}>
                        Отмена
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handlerConfirm}>
                        Подтвердить
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}