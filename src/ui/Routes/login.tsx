import { useEffect, useState } from "react";

interface IUserData {
    id: string,
    name: string
}

export default function Login() {
    
    const [userData, setUserData] = useState<IUserData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("http://localhost:3000/api/login", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                }
            });
            setUserData(await res.json());
        }
        fetchData();
    }, [])

    return(
        <div>
            { userData.length > 0 ? (
                userData.map(item => <h1 key={item.id}>{item.name}</h1>)
               ) : (
                <p>Загрузка</p>
            )
            }
        </div>
    );
}