
import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy, Globe } from "lucide-react";

import {
    PopoverTrigger,
    Popover,
    PopoverContent
} from "@/components/ui/popover"
import useOrigin from "@/hooks/use-origin";
import { Button } from "@/components/ui/button";
import { INote } from "@/interfaces/INote";


interface IPublishProps {
    initialData: INote;
    refresh: () => void;
}

export default function Publish({ initialData, refresh } : IPublishProps) {

    const origin = useOrigin();

    const [copied, setCopied] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const url = `${origin}/preview/${initialData.noteId}`;

    function onPublished() {

        setIsSubmitting(true);
        
        //@ts-ignore
        const promise = window.electronAPI.updateNote(initialData.id, true).finally(() => {
            setIsSubmitting(false);
            refresh();
        });

        toast.promise(promise, {
            loading: "Публикация...",
            success: "Опубликованно!",
            error: "Ошибка в публикации заметки."
        })
    }

    function onUnpublish() {
        setIsSubmitting(true);
        
        //@ts-ignore
        const promise = window.electronAPI.updateNote(initialData.id, true).finally(() => {
            setIsSubmitting(false);
            refresh();
        });
        
        toast.promise(promise, {
            loading: "Отмена публикации...",
            success: "Заметка была снята с публикации!",
            error: "Ошибка с снятии публикации заметки."
        })
    }

    function onCopy(){
        navigator.clipboard.writeText(url);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000)
    }

    return(
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost">
                    Поделиться
                    {
                        initialData.isPublished && (
                            <Globe className="text-sky-500 w-4 h-4 ml-2" />
                        )
                    }
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72" align="end" alignOffset={8} forceMount >
                    {
                        initialData.isPublished ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-x-2">
                                    <Globe className="text-sky-500 animate-pulse h-4 w-4" />
                                    <p className="text-xs font-medium text-sky-500">
                                        Заметка транслируется в интернете
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <input 
                                        className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
                                        value = {url}
                                        disabled
                                    />
                                    <Button
                                        onClick={onCopy}
                                        disabled={ copied }
                                        className="h-8 rounded-l-none"
                                    >
                                        {
                                            copied ? (
                                                <Check className="h-4 w-4" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )
                                        }
                                    </Button>
                                </div>
                                <Button
                                    size="sm"
                                    className="w-full text-xs"
                                    disabled={isSubmitting}
                                    onClick={onUnpublish}
                                >
                                    Снять с публикации
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center">
                                <Globe
                                    className="h-8 w-8 text-muted-foreground mb-2"
                                />
                                <p className="text-sm font-medium mb-2">
                                    Опубликовать эту заметку
                                </p>
                                <span className="text-xs text-muted-foreground mb-4">
                                    Поделить своей заметкой с другими.
                                </span>
                                <Button disabled = {isSubmitting} onClick={onPublished} className="w-full text-xs" size="sm">
                                    Опубликовать
                                </Button>
                            </div>
                        )
                    }
            </PopoverContent>
        </Popover>
    );
}