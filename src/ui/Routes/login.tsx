
import { Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/ui/login-form";
import Spinner from "@/components/ui/spinner";

export default function login() {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [visibility, setVisibility] = useState(false);
  // const [textForm, setTextForm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    //@ts-ignore
    window.electronAPI.syncDeepLinkGoogle((event, data) => {
        console.log("полученный диплинк из document page", data);
        window.localStorage.setItem("user", JSON.stringify(data));
        navigate("/document");
   })
 }, [])

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch('http://localhost:3000/api/authenticate', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         email, password
  //       }),
  //     });
  //     if (response.ok) {
  //       setStatus(true);
  //       setVisibility((prev) => !prev);
  //       response.json().then((item) => {
  //         window.localStorage.setItem("user", JSON.stringify(item));
  //         navigate("/document");
  //       });
        
  //       return;

  //     } else {
  //       setStatus(false);
  //       return;
  //     }
  //   } catch (error: any) {
  //     throw new Error("Упс! Вышла какая-то ошибочка!");
  //   }
  // };

  // return (
  //   <div>
  //     <h2>Вход</h2>
  //     <form onSubmit={handleSubmit}>
  //       <label>
  //         Логин:
  //         <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
  //       </label>
  //       <br />
  //       <label>
  //         Пароль:
  //         <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
  //       </label>
  //       <br />
  //       <Button variant="ghost" type="submit">Авторизироваться</Button>
  //     </form>
  //     <Button variant="outline" onClick={() => {
  //       //@ts-ignore
  //       window.electronAPI.handleOpenGoogleProvirder("google");
  //     }}>Войти с помощью google</Button>

  //     <Button onClick={() => {
  //       //@ts-ignore
  //       window.electronAPI.handleOpenGoogleProvirder("yandex");
  //     }}>Войти с помощью яндекс</Button>
  //     {
  //       <span></span>
  //     }
  //     <ModeToggle/>
  //   </div>
  // )

  return (
    <div className="h-full dark:bg-[#1f1f1f]">
      <main className="h-full pt-20 dark:bg-[#1f1f1f]">
      <div className="min-h-full flex flex-col">
            <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
              <div className="grid h-full place-items-center">
                <div className="flex w-full max-w-sm flex-col gap-7">
                  <Suspense fallback = { <div><Spinner/></div> }>
                    <LoginForm />
                  </Suspense>
                </div>
              </div>
            </div>
        </div>
      </main>
    </div>
  )
}
