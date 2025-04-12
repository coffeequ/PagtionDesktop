import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useSettings } from "@/hooks/use-settings";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/ui/mode-toggle"
import NoteInput from "@/components/ui/note-input"
import { useEffect, useState } from "react";

export default function SettingsModal(){

    const settings = useSettings();
    const [notePath, setNotePath] = useState("");
    const [filePath, setFilePath] = useState("");
    
    useEffect(() => {
        //@ts-ignore
        window.electronAPI.GetNotePath().then((item) => {
            setNotePath(item);
        });

        //@ts-ignore
        window.electronAPI.GetFilePath().then((item) => {
            setFilePath(item);
        });

    }, [])

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
            </DialogContent>
        </Dialog>
    );
}



