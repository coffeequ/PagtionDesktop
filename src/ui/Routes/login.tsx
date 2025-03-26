import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    //@ts-ignore
    window.electronAPI.syncDeepLinkGoogle((event, data) => {
        console.log("полученный диплинк из document page", data);
        window.localStorage.setItem("user", JSON.stringify(data));
        navigate("/document");
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

        response.json().then((item) => {
          window.localStorage.setItem("user", JSON.stringify(item));
          navigate("/document");
        });
        
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
      <button onClick={() => {
        //@ts-ignore
        window.electronAPI.handleOpenGoogleProvirder();
      }}>Войти с помощью google</button>
      { status ? (
        <p className="bg-emerald-600">Успешный вход!</p>
      ) : (
        <p className="bg-red-400">Ошибка авторизации!</p>
      ) }
    </div>
  )
}
