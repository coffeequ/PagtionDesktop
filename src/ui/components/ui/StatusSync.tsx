import { useEffect, useState } from "react";
import { Button } from "./button";
import { Check, FileWarning, Folder } from "lucide-react";
import Spinner from "./spinner";


export default function StatusSync(){
    
    const [isSync, setIsSync] = useState<"True" | "False" | "Error">("True");

    const [isSyncStatus, setIsSyncStatus] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try{
                //@ts-ignore
                const status = await window.electronAPI.GetIsStatusSync();
                
                setIsSync(status);
                
                //@ts-ignore
                const sendStatus = await window.electronAPI.GetIsSendStatus();
                
                setIsSyncStatus(sendStatus);
                
                console.log("status sync:", status);
                console.log("send status :", sendStatus);
            } catch {
                console.log("Get status");
            }
        }
        fetchData();

        //TODO: Починить визуализацию, а потом посмотреть другие варианты по отображению синхронизации. В плане, может не через интервал отображения, а через внутренние функции. Но все равно будет использоваться интервал для получения текущего состояния синхронизации
        const interval = setInterval(fetchData, 500);

        return () => clearInterval(interval);
        
    }, []);
    
    return(
        <Button variant="ghost" disabled={ true }>
            {
                !isSyncStatus ? (
                    <span className="flex flex-row items-center justify-center">
                        Синхронизации выкл
                        < Folder className="ml-2"/>
                    </span>
                ):(
                    <div>
                        {
                        isSync === "True" && (
                            <span>
                                <Check/>
                            </span>
                        )
                    }
                    {
                        isSync === "False" && (
                            <span>
                                <Spinner/>
                            </span>
                        )
                    }

                    {
                        isSync === "Error" && (
                            <span className="flex flex-col">
                                Ошибка синхронизации
                                <FileWarning className="mr-2"/>
                            </span>
                        )
                    }
                    </div>
                )
            }
        </Button>
    )
}