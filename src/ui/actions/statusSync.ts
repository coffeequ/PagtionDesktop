
export const GetStatusSync = () => {
    const res = localStorage.getItem("status");
    console.log("status-res: ", res);
    if(res === "true"){
        return true;
    }
    else{
        return false;
    }
}

export const SetStatusSync = (status: boolean) => {
    const statusStringify: string = `${status}`; 
    localStorage.setItem("status", statusStringify);
}