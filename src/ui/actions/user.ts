interface IUser {
    id: string,
    email: string,
    name: string,
    image: string | null
}

export function GetUser(){
    
    const getUser = localStorage.getItem("user");

    const user: IUser = JSON.parse(getUser as string);

    return user;
}

export function Logout(){
    
    //@ts-ignore
    window.electronAPI.LogoutAfterDeleteNotes();

    localStorage.removeItem("user");


}