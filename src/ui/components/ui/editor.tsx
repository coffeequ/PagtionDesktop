
import{
    BlockNoteSchema,
    combineByGroup,
    filterSuggestionItems,
    PartialBlock,
} from "@blocknote/core";
import { getDefaultReactSlashMenuItems, SuggestionMenuController, useCreateBlockNote } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/mantine"
import { ru } from "@blocknote/core/locales"

import "@blocknote/mantine/style.css"

import {
    getMultiColumnSlashMenuItems,
    multiColumnDropCursor,
    locales as multiColumnLocales,
    withMultiColumn,
} from "@blocknote/xl-multi-column";

import { useDebounceCallback } from "usehooks-ts";
import { useEffect, useMemo } from "react";
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

    const editor = useCreateBlockNote({
        schema: withMultiColumn(BlockNoteSchema.create()),
        dropCursor: multiColumnDropCursor,
        dictionary: {
            ...ru,
            multi_column: multiColumnLocales.ru,
        },
        initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined,
        uploadFile: handeUpload
    });

    const getSlashMenuItems = useMemo(() => {
        return async (query: string) =>
          filterSuggestionItems(
            combineByGroup(
              getDefaultReactSlashMenuItems(editor),
              getMultiColumnSlashMenuItems(editor)
            ),
            query
          );
    }, [editor]);


   useEffect(() => {
    editor.onChange(() => {debouncedOnChange(JSON.stringify(editor.document, null, 2))});
   }, [debouncedOnChange, editor]);
    
    return(
        <div>
            <BlockNoteView editor={editor} theme={ theme === "dark" ? "dark" : "light" } editable = {editable}>
                <SuggestionMenuController triggerCharacter={"/"} getItems={getSlashMenuItems} />
            </BlockNoteView>
        </div>
    );
}

export default Editor;