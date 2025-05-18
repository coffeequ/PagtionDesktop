import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Toolbar from "@/components/ui/toolbar";
import useRefreshStore from "@/hooks/use-refresh";
import { GetUser } from "@/actions/user";
import { useParams } from "react-router-dom";
import { INote } from "@/interfaces/INote";
import Spinner from "@/components/ui/spinner";
import { useCoverImage } from "@/hooks/use-cover-image";
import Cover from "@/components/ui/cover";

export default function DocumentIdPage(){

    const { id } = useParams();

    const { url, setCoverImage } = useCoverImage();

    const Editor = useMemo(() => lazy(() => import('@/components/ui/editor')), []);
    
    const triggerRefresh = useRefreshStore((state) => state.triggerRefresh);

    const user = GetUser();

    const [document, setDocument] = useState<INote>();

    useEffect(() => {
        async function fetchDocument(){
            // console.log("user-dynamicDocument: ", user);
            if(!user.id){
                throw new Error("Не найден id пользователя");
            };
            //@ts-ignore
            await window.electronAPI.idNote(id).then((item) => {
                setDocument(item);
                if(item.coverImage){
                    setCoverImage(item.coverImage);
                }
                else{
                    setCoverImage("");
                }
            });
        }
        fetchDocument();
    }, [id as string,]);

    //Смена наименования заметки
    const onChangeTitle = useCallback(async (title: string) => {
        if(title === ""){
            title = "Untitled";
        }
        //@ts-ignore
        await window.electronAPI.updateNote({id: id as string, title});
        triggerRefresh();
    }, [id as string]);

    //Смена конента заметки
    const onChangeContent = useCallback(async (content: string) => {
        //@ts-ignore
        await window.electronAPI.updateNote({id: id as string, content});
        triggerRefresh();
    }, [id as string])

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
            <Cover key={url} url={url} />
            <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
                <Toolbar key={ document.id } initialData = { document } onTitleChange={onChangeTitle} />
                <Suspense fallback={<Spinner/>}>
                    <Editor key={ document.id } onChange={onChangeContent} initialContent={document.content} />
                </Suspense>
            </div>
        </div> 
    );
}