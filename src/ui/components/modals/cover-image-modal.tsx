
import{
    Dialog, DialogContent, DialogHeader
} from "@/components/ui/dialog"

import { useCoverImage } from "@/hooks/use-cover-image";

import { SingleImageDropzone } from "../ui/single-image-dropzone";
import { useState } from "react";
import { useMatch } from "react-router-dom";


export default function CoverImageModal(){

    const match = useMatch("/document/:id");

    const params = match?.params.id;

    const coverImage = useCoverImage();
        
    const [file, setFile] = useState<File>();

    const [isSubmitting, setIsSubmitting] = useState(false);

    function onClose() {
        setFile(undefined);
        setIsSubmitting(false);
        coverImage.onClose();
    }

    async function onChange(file?: File) {
        if(file){
            // console.log(file);
            setIsSubmitting(true);
            setFile(file);
            
            const name = file.name;
            const arrayBuffer = await file.arrayBuffer();
            
            //@ts-ignore
            const res = await window.electronAPI.handleUploadFile({name, arrayBuffer});

            //@ts-ignore
            await window.electronAPI.updateNote({ noteId: params, coverImage: res})

            coverImage.setCoverImage(res);
            setTimeout(() => coverImage.setCoverImage(res), 100);
            onClose();
        }
    }

    return(
        <Dialog open = {coverImage.isOpen} onOpenChange={coverImage.onClose}>
            <DialogContent>
                <DialogHeader>
                    <h2 className="text-center text-lg font-semibold">
                        Изображение
                    </h2>
                </DialogHeader>
                <SingleImageDropzone className="w-full outline-none" disabled = {isSubmitting} value={file} onChange={onChange} />
            </DialogContent>
        </Dialog>
    );
}