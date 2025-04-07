"use client"

import IconPicker from "./icon-picker";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ComponentRef, useRef, useState } from "react";

import TextareaAutosize from "react-textarea-autosize"

import { useDebounceCallback } from "usehooks-ts";
import useRefreshStore from "@/hooks/use-refresh";
import { INote } from "@/interfaces/INote";

interface IToolbarProps {
    initialData: INote
    preview?: boolean,
    onTitleChange: (title: string) => void;
}

export default function Toolbar({ initialData, preview, onTitleChange } : IToolbarProps){

    const inputRef = useRef<ComponentRef<"textarea">>(null);

    const [icon, setIcon] = useState(initialData.icon);

    const [isEditing, setIsEditing] = useState(false);

    const [value, setValue] = useState(initialData.title);

    const debounceTitleChange = useDebounceCallback(onTitleChange, 200);

    const triggerRefresh = useRefreshStore((state) => state.triggerRefresh);

    function enableInput() {
        if(preview) return;
        setIsEditing(true);
        setTimeout(() => {
            setValue(value);
            inputRef.current?.focus();
        }, 0);
    }

    function disableInput(){
        setIsEditing(false);
        debounceTitleChange(value);
    }

    function onInput(value: string) {
        setValue(value);
        debounceTitleChange(value);
    }

    function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>){
        if(event.key === "Enter"){
            event.preventDefault();
            disableInput();
        }
    }

    function onIconSelect(icon: string){
        //@ts-ignore
        window.electronAPI.updateNote({noteId: initialData.noteId, icon}).then((item) => setIcon(item.icon));
        triggerRefresh();
    }

    function onIconRemove(){
        //@ts-ignore
        window.electronAPI.idNote(initialData.noteId).then((item: INote) =>{
            item.icon = "";
            setIcon("");
        });
        triggerRefresh();
    }

    return(
        <div className="pl-[54px] group relative">
            {
                !!icon && !preview && (
                    <div className="flex items-center gap-x-2 group/icon pt-6">
                        <IconPicker onChange={onIconSelect}>
                            <p className="text-6xl hover:opacity-75 transition">
                                {icon}
                            </p>
                            <Button onClick={onIconRemove} className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs" variant='outline' size="icon">
                                <X className="h-4 w-4"/>
                            </Button>
                        </IconPicker>
                    </div>
                )
            }
            {
                isEditing && !preview ? (
                    <TextareaAutosize 
                        ref={inputRef}
                        onBlur={disableInput}
                        onKeyDown={onKeyDown}
                        value={value}
                        onChange={(e) => onInput(e.target.value)}
                        className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
                    />
                ): (
                    <div onClick={enableInput} aria-placeholder="Untitled" className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]">
                        {
                            value && (
                                <p>{value}</p>
                            ) || (
                                <p>Untitled</p>
                            )
                        }
                    </div>
                )
            }
        </div>
    );    
}