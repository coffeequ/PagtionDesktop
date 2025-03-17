import { useState } from "react";

export default function login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      const response = await fetch('http://localhost:3000/api/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          email, password
        }),
      });
      const result = await response.json();
      if (result.success) {
        setStatus(true);
        return { id: result};
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
        <button type="submit">Отправить данные</button>
      </form>
      { status ? (
        <p >Успешный вход!</p>
      ) : (
        <p>Ошибка авторизации!</p>
      ) }
    </div>
  )
}
