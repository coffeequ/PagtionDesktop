import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useSettings } from "@/hooks/use-settings";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/ui/mode-toggle"
import NoteInput from "@/components/ui/note-input"
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Folder, FolderSync } from "lucide-react";
import { cn } from "@/lib/utils"
import { GetStatusSync, SetStatusSync } from "@/actions/statusSync";

export default function SettingsModal(){

    const settings = useSettings();
    
    const [notePath, setNotePath] = useState("");

    const [filePath, setFilePath] = useState("");

    const [statusSyncUI, setStatusSyncUI] = useState<boolean>(GetStatusSync());

    useEffect(() => {
        //@ts-ignore
        window.electronAPI.GetNotePath().then((item) => {
            setNotePath(item);
        });

        //@ts-ignore
        window.electronAPI.GetFilePath().then((item) => {
            setFilePath(item);
        });

        onHandleSyncData()

    }, [])


    const onHandleSyncData = async () => {
        //Включение
        if(statusSyncUI){
            SetStatusSync(true);
            //@ts-ignore
            window.electronAPI.StartSend();
        }
        else{
            SetStatusSync(false);
            //@ts-ignore
            window.electronAPI.StopSend();
        }
        //Выключение
        setStatusSyncUI((prev) => !prev);
    } 

    return (
        <Dialog open = {settings.isOpen} onOpenChange={settings.onClose}>
            <DialogContent>
                <DialogHeader className="border-b pb-3">
                    <h2 className="text-lg font-medium">
                        Мои настройки
                    </h2>
                </DialogHeader>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                        <Label>
                            Тема приложения
                        </Label>
                        <span className="text-[0.8rem] text-muted-foreground">
                            Найстрока темы Pagtion на вашем дейвайсе
                        </span>
                    </div>
                    <ModeToggle/>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                        <Label>
                            Заметки
                        </Label>
                        <span className="text-[0.8rem] text-muted-foreground">
                            Путь к папке со всеми заметками
                        </span>
                    </div>
                    <NoteInput url={notePath}/>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                        <Label>
                            Файлы
                        </Label>
                        <span className="text-[0.8rem] text-muted-foreground">
                            Путь к папке со всеми файлами
                        </span>
                    </div>
                    <NoteInput url={filePath}/>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                        <Label>
                            Синхронизация
                        </Label>
                        <span className="text-[0.8rem] text-muted-foreground">
                            Между устройствами. Функция находится в бета-тестировании*
                        </span>
                    </div>
                    <Button onClick={onHandleSyncData} className={cn(statusSyncUI ? "bg-secondary-foreground" : "")}>
                        {
                            statusSyncUI ? 
                            (
                                <div className="flex items-center">
                                    <span className="mr-2">Включить синхронизацию</span>
                                    <FolderSync/>
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <span className="mr-2">Выключить синхронизацию</span>
                                    <Folder/>
                                </div>
                            )
                        }
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}



