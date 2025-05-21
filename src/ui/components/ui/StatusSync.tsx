import { useState } from "react";
import { Button } from "./button";
import { Check } from "lucide-react";
import Spinner from "./spinner";



export default function StatusSync(){
    
    //@ts-ignore
    const [isSync, setIsSync] = useState(window.electronAPI.GetIsStatusSync());
    
    return(
        <Button variant="ghost" disabled={ true } >
            {
                isSync ? (
                    <span>
                        Синхронизация прошла успшено!
                        <Check className="animate-spin"/>
                    </span>
                ): (
                    <span>
                        <Spinner/>
                    </span>
                )
            }
        </Button>
    )
}