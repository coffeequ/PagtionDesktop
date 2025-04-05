
import{
    BlockNoteEditor,
    PartialBlock
} from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/mantine"
import "@blocknote/mantine/style.css"

import { useDebounceCallback } from "usehooks-ts";
import { useEffect } from "react";


interface IEditorProps{
    onChange: (value: string) => void;
    initialContent?: string | null;
    editable?: boolean;
}

function Editor({ onChange, initialContent, editable } : IEditorProps){
    
    //@ts-ignore
    const resolvedTheme  = window.electronAPI.currentTheme()

    const debouncedOnChange = useDebounceCallback(onChange, 200);

    const editor: BlockNoteEditor = useCreateBlockNote({
        initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined,
    });

   useEffect(() => {
    editor.onEditorContentChange(() => {debouncedOnChange(JSON.stringify(editor.document, null, 2))});
   }, [debouncedOnChange, editor]);
    
    return(
        <div>
            <BlockNoteView editor={editor} theme={ resolvedTheme === "dark" ? "dark" : "light" } editable = {editable}>

            </BlockNoteView>
        </div>
    );
}

export default Editor;