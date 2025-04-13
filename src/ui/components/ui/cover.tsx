"use client"

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useParams } from "react-router-dom";

import { Skeleton } from "./skeleton";


interface ICoverProps {
    url?: string,
    preview?: boolean;
}

export default function Cover({ preview, url } : ICoverProps){
    
    const { id } = useParams();

    const {setCoverImage, onReplace} = useCoverImage();

    async function onRemove () {
        //@ts-ignore
        await window.electronAPI.updateNote({noteId: id, coverImage: ""});
        setCoverImage("");
    }
    
    return(
        <div className={cn("relative w-full h-[35vh] group",
            !url && "h-[12vh]",
            url && "bg-muted"
        )}>
            {
                !!url && (
                    <picture>
                        <img src={url} alt="Обложка" className="object-cover w-full h-full" />
                    </picture>
                )
            }
            {
                url && !preview && (
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
                        <Button onClick={() => onReplace(url as string)} className="text-muted-foreground text-xs dark:bg-neutral-600 dark:hover:bg-neutral-800" variant="outline">
                            <ImageIcon className="h-4 w-4 mr-4"/>
                            Поменять фон
                        </Button>
                        <Button onClick={onRemove} className="text-muted-foreground text-xs dark:bg-neutral-600 dark:hover:bg-neutral-800" variant="outline">
                            <X className="h-4 w-4 mr-4"/>
                            Удалить фон
                        </Button>
                    </div>
                )
            }
        </div>
    )
}

Cover.Skeleton = function CoverSkeleton() {
    return(
        <Skeleton className="w-full h-[12vh]" />
    );
}