
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { INote } from "@/interfaces/INote";

import { useRef, useState } from "react";


interface TitleProps{
    initialData: INote
}

export default function Title({initialData}: TitleProps){

    const inputRef = useRef<HTMLInputElement>(null); 

    const [title, setTitle] = useState(initialData.title || "Untitled");

    const [isEditing, setIsEditing] = useState(false);


    function enableInput(){
        setTitle(initialData.title);
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
        }, 0)
    }

    function disableInput(){
        setIsEditing(false);
    }

    function onChange(event: React.ChangeEvent<HTMLInputElement>){
        setTitle(event.target.value);
        //@ts-ignore
        window.electronAPI.update(initialData.id, event.target.value || "Untitled");
    }

    function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if(event.key === "Enter"){
            disableInput();
        }
    }

    return(
        <div className="flex items-center gap-x-1">
            {
                !!initialData.icon && (
                    <p>{initialData.icon}</p>
                )
            }
            {
                isEditing ? (
                    <Input ref = {inputRef} onClick={enableInput} onBlur={disableInput} onChange={onChange} onKeyDown={onKeyDown} value={title} className="h-7 px-2 focus-visible:ring-transparent" />
                ): (
                    <Button onClick={enableInput} variant="ghost" className="font-normal h-auto p-1">
                        <span className="truncate">
                            {initialData?.title}
                        </span> 
                    </Button>
                )
            }
        </div>
    );
}

Title.Skeleton = function TitleSkeleton(){
    return (
        <Skeleton className="h-9 w-20 rounded-md" />
    );
}