
import { MenuIcon } from "lucide-react";
import { useParams } from "react-router-dom";
//import Title from "./title";
import Banner from "./bannder";
import Menu from "./menu";
import Publish from "./publish";

import { useEffect, useState } from "react";
import { GetUser } from "@/actions/user";
import { INote } from "@/interfaces/INote";
import useRefreshStore from "@/hooks/use-refresh";
import StatusSync from "./StatusSync";


interface NavbarProps {
    isCollapsed: boolean;
    onResetWidth: () => void;
}

export default function Navbar({ isCollapsed, onResetWidth } : NavbarProps) {
    
    const [document, setDocuments] = useState<INote>();

    const [isRefresh, setIsRefresh] = useState(false);

    const shouldRefresh = useRefreshStore((state) => state.shouldRefresh);

    const user = GetUser();

    const { id } = useParams();

    useEffect(() => {
        const fetchDocuments = async () => {
            if(!user.id){
                throw new Error("Не найден id пользователя!");
            }

            // console.log("navbar useParams id: ", id);

            //@ts-ignore
            const data = await window.electronAPI.idNote(id as string, user.id);
            setDocuments(data); 
        }
        fetchDocuments();
    }, [isRefresh, shouldRefresh, id]);

    function refresh() {
        setIsRefresh((prev) => !prev);
    }

    if(document === undefined){
        return (
            <nav className="bg-background dark:bg-[#1f1f1f] px-3 py-2 w-full flex items-center justify-between">
                {/* <Title.Skeleton/> */}
                <div className="flex items-center gap-x-2">
                    <Menu.Skeleton/>
                </div>
            </nav>
        );
    }

    if(document === null){
        return null;
    }
    
    return(
        <>
            <nav className="bg-background dark:bg-[#1f1f1f] px-3 py-2 w-full flex items-center gap-x-4">
                {
                    isCollapsed && (
                        <MenuIcon role="button" onClick={onResetWidth} className="h-6 w-6 text-muted-foreground"/>
                    )
                }
                <div className="flex items-center justify-end w-full">
                    <div className="flex items-center gap-x-2">
                        <StatusSync/>
                        <Publish initialData = {document} refresh={refresh} />
                        <Menu documentId = {document.id} />
                    </div>
                </div>
            </nav>
            {
                document.isArchived && (
                    <Banner documentId = {document.id} />
                )
            }
        </>
    );
}