import { Check, Copy } from "lucide-react";
import { Button } from "./button";
import { useState } from "react";

interface IPropsNoteInput{
    url: string
}

export default function NoteInput({ url }: IPropsNoteInput) {

    const [copied, setCopied] = useState(false);

    function onCopy(){
        navigator.clipboard.writeText(url);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000)
    }

    return (
        <div className="flex items-center">
            <input 
                className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
                value = {url}
                disabled
            />
            <Button
                onClick={onCopy}
                disabled={ copied }
                className="h-8 rounded-l-none">
                {
                    copied ? (
                        <Check className="h-4 w-4" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )
                }
            </Button>
        </div>
    );
}