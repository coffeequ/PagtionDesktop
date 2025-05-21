import { useEffect, useState } from "react";
import { Button } from "./button";
import { Check } from "lucide-react";
import Spinner from "./spinner";



export default function StatusSync(){
    
    //@ts-ignore
    const [isSync, setIsSync] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try{
                //@ts-ignore
                const status = await window.electronAPI.GetIsStatusSync();
                setIsSync(status);
            } catch {
                console.log("Ошибка получения статуса");
            }
        }
        fetchData();

        const interval = setInterval(fetchData, 500);

        return () => clearInterval(interval);
    }, [])
    
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