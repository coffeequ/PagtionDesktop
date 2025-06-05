import { Suspense, useEffect } from "react";
import LoginForm from "@/components/ui/login-form";
import Spinner from "@/components/ui/spinner";
import { GetUser } from "@/actions/user";
import { useNavigate } from "react-router-dom";
import useRefreshStore from "@/hooks/use-refresh";

export default function login() {
  
  const navigate = useNavigate();

  const triggerRefresh = useRefreshStore((state) => state.triggerRefresh);

  useEffect(() => {
    let user = GetUser();

    if(user){
      navigate("/document/startPage");
    }
    else{
      //@ts-ignore
      user = window.electronAPI.syncDeepLinkGoogle(async (event, data) => {
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(data));

        triggerRefresh();
        
        navigate("/document/startPage");
    });
    triggerRefresh();
  }
}, [])
  
  return (
    <div className="grid h-full place-items-center">
      <div className="flex w-full max-w-sm flex-col gap-7">
        <Suspense fallback = { <div><Spinner/></div> }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
