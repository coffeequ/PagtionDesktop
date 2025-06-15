
export const GetStatusSync = () => {
    const res = localStorage.getItem("status");
    console.log("status-res: ", res);
    if(res !== null){
        if(res === "true"){
        return true;
    }
        else{
            return false;
        }
    }
    else{
        return false;
    }
}

export const SetStatusSync = async (status: boolean) => {
    const statusStringify: string = `${status}`; 
    
    localStorage.setItem("status", statusStringify);
}