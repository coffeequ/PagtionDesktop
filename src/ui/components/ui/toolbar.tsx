import { ComponentRef, useRef, useState } from "react";

import TextareaAutosize from "react-textarea-autosize"

import { useDebounceCallback } from "usehooks-ts";
import { INote } from "@/interfaces/INote";

interface IToolbarProps {
    initialData: INote
    preview?: boolean,
    onTitleChange: (title: string) => void;
}

export default function Toolbar({ initialData, preview, onTitleChange } : IToolbarProps){

    const inputRef = useRef<ComponentRef<"textarea">>(null);

    const [isEditing, setIsEditing] = useState(false);

    const [value, setValue] = useState(initialData.title);

    const debounceTitleChange = useDebounceCallback(onTitleChange, 200);

    // const triggerRefresh = useRefreshStore((state) => state.triggerRefresh);

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

    return(
        <div className="pl-[54px] group relative">
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