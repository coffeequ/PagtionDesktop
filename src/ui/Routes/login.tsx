import { Suspense, useEffect } from "react";
import LoginForm from "@/components/ui/login-form";
import Spinner from "@/components/ui/spinner";
import { GetUser } from "@/actions/user";
import { useNavigate } from "react-router-dom";

export default function login() {
  
  const navigate = useNavigate();

  useEffect(() => {
    //@ts-ignore
    //window.electronAPI.syncDeepLinkGoogle();
    let user = GetUser();
    if(user){
      navigate("/document/startPage");
    }
    else{
      //@ts-ignore
      user = window.electronAPI.syncDeepLinkGoogle((event, data) => {
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/document/startPage");
    });
    }
  }, [])
  
  return (
    <div className="h-full dark:bg-[#1f1f1f]">
      <main className="h-full pt-20 dark:bg-[#1f1f1f]">
        <div className="grid h-full place-items-center">
          <div className="flex w-full max-w-sm flex-col gap-6">
            <Suspense fallback = { <div><Spinner/></div> }>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}
