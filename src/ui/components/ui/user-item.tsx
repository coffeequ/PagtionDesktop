import { ChevronsLeftRight, User } from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GetUser, Logout } from "@/actions/user";

export default function UserItem(){

    const user = GetUser();
    
    const navigate = useNavigate();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div role="button" className="flex items-center text-sm p-3 w-full hover:bg-primary/5">
                    <div className="gap-x-2 flex items-center max-w-[150px]">
                        <span className="text-start font-medium line-clamp-1">
                            {user.name}
                        </span>
                    </div>
                    <ChevronsLeftRight className="rotate-90 ml-2 text-muted-foreground h-4 w-4"/>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="start" alignOffset={11} forceMount>
                <div className="flex flex-col space-y-4 p-2">
                    <p className="text-xs font-medium leading-none text-muted-foreground">
                        {user.email}
                    </p>
                </div>
                <div className="flex items-center gap-x-2">
                    <div className="rounded-md bg-secondary p-1">
                        <Avatar className="h-5 w-5">
                            {
                                !user.image ? (
                                    <User/>
                                ):(
                                    <AvatarImage src={user.image} />
                                )
                            }
                        </Avatar>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm line-clamp-1">
                            {user.name} Pagtion 
                        </p>
                    </div>
                </div>
                <DropdownMenuSeparator/>
                <DropdownMenuItem asChild className="w-full cursor-pointer text-muted-foreground">
                    <Button variant="ghost" onClick={() => {
                        if(user){
                            Logout();
                            navigate("/login");
                        }
                    }}>
                        Выйти
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}