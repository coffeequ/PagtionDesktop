import { useState } from "react";


export default function Login() {
    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/auth/signin", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({ email, password })
                });
                if(res.ok){
                    const { token } = await res.json();
                    console.log(token);
                    //@ts-ignore
                    window.electronAPI.sendLoginSuccess(token);
                }
                else{
                    //setError("Не верные учетные данные");
                }
            } catch (error) {
                console.log(error);
                //setError("Ошибка авторизации");
            }
        }
        fetchData();
    }

    return(
        <div>
            <h1>Авторизация</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" 
                    placeholder="email пользователя" 
                    value={email} onChange={(e: React.FormEvent<HTMLInputElement>) => {
                        console.log(e.currentTarget.value);
                        setEmail(e.currentTarget.value);
                    }}
                />
                <br/>
                <input type="password" 
                    placeholder="пароль пользователя" 
                    value={password} onChange={(e: React.FormEvent<HTMLInputElement>) => {
                        console.log(e.currentTarget.value);
                        setPassword(e.currentTarget.value);
                    }}
                />
                <br/>
                <button type="submit">Отправить</button>
            </form>
        </div>
    );
}