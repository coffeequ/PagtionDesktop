import { lazy, Suspense, useCallback, useEffect, useState } from "react";

import Toolbar from "@/components/ui/toolbar";
import useRefreshStore from "@/hooks/use-refresh";
import { GetUser } from "@/actions/user";
import { useParams } from "react-router-dom";
import { INote } from "@/interfaces/INote";
import Spinner from "@/components/ui/spinner";

export default function DocumentIdPage(){

    const params = useParams();

    const Editor = lazy(() => import('@/components/ui/editor'));
    
    const triggerRefresh = useRefreshStore((state) => state.triggerRefresh);

    const user = GetUser();

    const [document, setDocument] = useState<INote>();

    useEffect(() => {
        async function fetchDocument(){
            if(!user.id){
                throw new Error("Не найден id пользователя");
            };
            console.log(params.id);
            //@ts-ignore
            const document = await window.electronAPI.idNote(params.id);
            console.log("document: ", document);
            setDocument(document);
        }
        fetchDocument();
    }, [params.id as string]);

    const onChangeTitle = useCallback((title: string) => {
        if(title === ""){
            title = "Untitled";
        }
        //@ts-ignore
        window.electronAPI.updateNote(params.id as string,title);
        triggerRefresh();
    }, [params.id as string]);

    const onChangeContent = useCallback((content: string) => {
        //@ts-ignore
        const result = window.electronAPI.updateNote(params.id as string, content);

        //@ts-ignore
        window.electronAPI.editNotes(result);

    }, [params.id as string])

    if(document === undefined){
        return(
            <div>
                <Spinner/>
            </div>
        );
    }

    if(document === null){
        return(
            <div>
                Страница была не найдена.
            </div>
        );
    }
    
    return(
        <div className="pb-40 dark:bg-[#1F1F1F]">
            <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
                <Toolbar initialData = { document } onTitleChange={onChangeTitle} />
                <Suspense fallback={<Spinner/>}>
                    <Editor onChange={onChangeContent} initialContent={document._content} />
                </Suspense>
            </div>
        </div> 
    );
}