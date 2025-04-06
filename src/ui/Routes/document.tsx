import { Outlet } from "react-router-dom";
import Navigation from "@/components/ui/navigation";

export default function DocumentPage(){    
    return(
        <div className="h-full flex dark:bg-[#1F1F1F]">
            <main className="flex-1 h-full overflow-y-auto">
                {/* <SearchCommand/> */}
                <Navigation/>
                <Outlet/>
            </main>
        </div>
    );
}