import { useEffect } from "react";

export default function DocumentPage(){
    useEffect(() => {
        //@ts-ignore
        window.electronAPI.syncDeepLinkGoogle((event, data) => {
         console.log("полученный диплинк из document page", data);
       })
     }, [])
   
    return(
        <div>
            <h1>Hello world after auth</h1>
        </div>
    );
}