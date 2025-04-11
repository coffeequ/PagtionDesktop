import { Outlet } from "react-router-dom";
import Navigation from "@/components/ui/navigation";
import SearchCommand from "@/components/ui/search-command";

export default function DocumentPage(){

    return(
        <div className="h-full flex dark:bg-[#1F1F1F]">
            <Navigation/>
            <main className="flex-1 h-full overflow-y-auto">
                <SearchCommand/>
                <Outlet/>
            </main>
        </div>
    );
}