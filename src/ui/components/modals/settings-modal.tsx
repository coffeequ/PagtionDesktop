import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useSettings } from "@/hooks/use-settings";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/ui/mode-toggle"

export default function SettingsModal(){
    const settings = useSettings();

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
            </DialogContent>
        </Dialog>
    );
}



