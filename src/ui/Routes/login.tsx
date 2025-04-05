import { Suspense, useEffect } from "react";
import LoginForm from "@/components/ui/login-form";
import Spinner from "@/components/ui/spinner";
import { GetUser } from "@/actions/user";
import { useNavigate } from "react-router-dom";

export default function login() {
  
  const navigate = useNavigate();

  useEffect(() => {
    const user = GetUser();
    console.log(user);
    if(user){
      navigate("/document");
    }
  }, [])
  
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
