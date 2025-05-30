import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import useRefreshStore from "@/hooks/use-refresh";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { INote } from "@/interfaces/INote";

interface IUser {
    id: string,
    email: string,
    name: string,
    image: string | null
}


interface ItemProps {
    id?: string;
    documentIcon?: string;
    active?: boolean;
    expanded?: boolean;
    isSearch?: boolean;
    level?: number;
    onExpand?: () => void;
    label: string;
    onClick?: () => void;
    icon: LucideIcon;
    refreshDocuments?: () => void;
}

export default function Item( {id, label, onClick, icon:Icon, active, expanded, onExpand, level = 0, documentIcon, isSearch, refreshDocuments}: ItemProps ){
    
    const navigate = useNavigate();

    const shouldRefresh = useRefreshStore((state) => state.triggerRefresh);

    const getUser = localStorage.getItem("user");

    const user: IUser = JSON.parse(getUser as string);

    const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        if(!id || !user.id) return;
        //@ts-ignore
        const promise = window.electronAPI.archived(id, user.id).then(() => {
            navigate(`/document/startPage`);
            refreshDocuments?.();
        });
        toast.promise(promise, {
            loading: "Перемещение в мусорку...",
            success: "Страница была перемещена в корзину!",
            error: "Перемещение не удалось."
        })
    }

    function handleExpand(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        event.stopPropagation();
        onExpand?.();
    }

    function onCreate(event: React.MouseEvent<HTMLDivElement, MouseEvent>){
        event.stopPropagation();
        if(!id || !user.id) return;
        //@ts-ignore
        const promise = window.electronAPI.createNote("Untitled", user.id, id)
            .then((document: INote) => {
                if(!expanded){
                    onExpand?.();
                }
                else{
                    shouldRefresh();
                }
            navigate(`/document/${document.id}`);
        });

        toast.promise(promise, {
            loading: "Создание новой заметки...",
            success: "Заметка была успешно создана",
            error: "Ошибка создании заметки"
        });

    }

    const ChevronIcon = expanded ? ChevronDown : ChevronRight;
    
    return(
        <div onClick={onClick} role = "button" style= {{ paddingLeft: level ? `${(level * 12) + 12}px` : "12px" }} className={cn("group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium", active && "bg-primary/5 text-primary")}>
            {!!id && (
                <div role = "button" className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1" onClick={handleExpand}>
                    <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                </div>
            )}
            {documentIcon ? (
                <div className="shrink-0 mr-2 text-[18px]">
                    {documentIcon}
                </div>
            ): (
                <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
            )}
            <span className="truncate">
                {label}
            </span>
            {isSearch && (
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">Ctrl</span> + k
                </kbd>
            )}
            {
                !!id && (
                    <div className="ml-auto flex items-center gap-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
                                <div role="button" className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600">
                                    <MoreHorizontal className="h-4 w-4 text-muted-foreground"/>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-60" align="start" side="right" forceMount >
                                <DropdownMenuItem onClick={onArchive}>
                                    <Trash className="h-4 w-4 mr-2"/>
                                    Удалить
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <div className="text-xs text-muted-foreground p-2">
                                    Последний кто изменял: {user.name}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <div role="button" onClick={onCreate} className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600">
                            <Plus className="h-4 w-4 text-muted-foreground"/>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }){
    return(
        <div
        style = {{
            paddingLeft: level ? `${(level * 12) + 25}px` : "12px"
        }}
        className="flex gap-x-2 py-[3px]"
        >
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-[30%]" />
        </div>
    )
}