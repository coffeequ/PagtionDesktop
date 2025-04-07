import { Suspense, useEffect } from "react";
import LoginForm from "@/components/ui/login-form";
import Spinner from "@/components/ui/spinner";
import { GetUser } from "@/actions/user";
import { useNavigate } from "react-router-dom";

export default function login() {
  
  const navigate = useNavigate();

  useEffect(() => {
    const user = GetUser();
    //console.log(user);
    if(user){
      navigate("/document/startPage");
    }
  }, [])
  
  return (
    <div className="h-full dark:bg-[#1f1f1f]">
      <main className="h-full pt-20 dark:bg-[#1f1f1f]">
        <Suspense fallback={<Spinner/>}>
          <LoginForm/>
        </Suspense>
      </main>
    </div>
  )
}
