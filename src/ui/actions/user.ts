interface IUser {
    id: string,
    email: string,
    name: string,
    image: string | null
}

const getUser = localStorage.getItem("user");

const user: IUser = JSON.parse(getUser as string);

export function GetUser(){
    return user;
}