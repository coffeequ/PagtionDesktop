import { useEffect, useState } from "react";
import { redirect } from "react-router-dom";

export default function login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(false);


  useEffect(() => {
    //@ts-ignore
    window.electronAPI.syncDeepLinkGoogle((event, data) => {
        console.log("полученный диплинк из document page", data);
        window.localStorage.setItem("user", JSON.stringify(data));
        redirect("/document");
   })
 }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email, password
        }),
      });
      if (response.ok) {
        setStatus(true);

        const result = await response.json();

        window.localStorage.setItem("user", JSON.stringify(result));
        
        console.log(result);

        redirect("/document");

        return;
        
      } else {
        setStatus(false);
        return;
      }
    } catch (error: any) {
      throw new Error("Упс! Вышла какая-то ошибочка!");
    }
  };

  return (
    <div>
      <h2>Вход</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Логин:
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />
        <label>
          Пароль:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="submit">Авторизироваться</button>
      </form>
      { status ? (
        <p >Успешный вход!</p>
      ) : (
        <p>Ошибка авторизации!</p>
      ) }
      <button onClick={() => {
        //@ts-ignore
        window.electronAPI.handleOpenGoogleProvirder();
      }}>Войти с помощью google</button>
    </div>
  )
}
