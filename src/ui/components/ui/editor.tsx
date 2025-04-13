
import{
    BlockNoteEditor,
    PartialBlock,
} from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/mantine"
import { ru } from "@blocknote/core/locales"

import "@blocknote/mantine/style.css"

import { useDebounceCallback } from "usehooks-ts";
import { useEffect } from "react";
import { useTheme } from "@/providers/theme-providers";


interface IEditorProps{
    onChange: (value: string) => void;
    initialContent?: string | null;
    editable?: boolean;
}

function Editor({ onChange, initialContent, editable } : IEditorProps){
    
    const { theme } = useTheme();

    const debouncedOnChange = useDebounceCallback(onChange, 200);

    async function handeUpload(file: File){
        // console.log(file);
        const name = file.name;
        const arrayBuffer = await file.arrayBuffer();
        //@ts-ignore
        return window.electronAPI.handleUploadFile({name, arrayBuffer});
    }

    const editor: BlockNoteEditor = useCreateBlockNote({
        initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined,
        dictionary: ru,
        uploadFile: handeUpload
    });

   useEffect(() => {
    editor.onChange(() => {debouncedOnChange(JSON.stringify(editor.document, null, 2))});
   }, [debouncedOnChange, editor]);
    
    return(
        <div>
            <BlockNoteView editor={editor} theme={ theme === "dark" ? "dark" : "light" } editable = {editable}>

            </BlockNoteView>
        </div>
    );
}

export default Editor;