import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "./input"
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/shemas";
import { Link, useNavigate } from "react-router-dom"
import { FormError } from "./form-error"
import { FormSucces } from "./form-success"
import { useState, useTransition } from "react"

export default function LoginForm(){

    const navigate = useNavigate();

    const [isPading, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const handleSubmitForms = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");

        startTransition(async () => {
            const email = values.email;
            const password = values.password;
    
            try {
                const response = await fetch('https://pagtion.vercel.app/api/authenticate', {
                        method: 'POST',
                        headers: {
                                'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email, password
                        }),
                    });
                if(response.ok) {
                    response.json().then((item) => {
                    window.localStorage.setItem("user", JSON.stringify(item));
                    //@ts-ignore
                    window.electronAPI.SaveUserData(item);
                    setSuccess("Авторизация прошла успешно!");
                    navigate("/document/startPage");});
                return;
              } else {
                setError("Произошла ошибка авторизации");
                return;
              }
            } catch (error: any) {
                setError("Упс... Произошла ошибка авторизации");
            }  
        })
    };

    return (
        <div className="flex flex-col">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmitForms)} className="space-y-6">
                    <div className="space-y-4">
                    <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Почта
                                </FormLabel>
                                <FormControl>
                                    <Input
                                    {...field}
                                    placeholder="example@mail.ru"
                                    type="email"
                                    disabled={isPading}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Пароль
                                </FormLabel>
                                <FormControl>
                                    <Input
                                    {...field}
                                    placeholder="123"
                                    type="password"
                                    disabled={isPading}
                                    />
                                </FormControl>
                                <Button size="sm" variant="link" asChild className="px-0 font-normal justify-start" onClick={() => {
                                    //@ts-ignore
                                    window.electronAPI.handleOpenReset()
                                }}>
                                    <Link to="">
                                        Забыл пароль
                                    </Link>
                                </Button>
                                <FormMessage/>
                            </FormItem>
                        )} />
                    </div>
                    <FormError message={error}/>
                    <FormSucces message={success}/>
                    <Button type="submit" className="w-full">
                        Авторизироваться
                    </Button>
                </form>
            </Form>
            <div className="flex justify-center mt-2">
                <Button variant="link" onClick={() => {
                    //@ts-ignore
                    window.electronAPI.handleOpenRegister()
                }}>
                    Нет аккаунта? Попробуйте создать его!
                </Button>
            </div>
            <hr className="w-48 h-1 mx-auto my-2 bg-gray-200 border-0 rounded-sm md:my-4 dark:bg-gray-500"/>
            <Button variant="ghost" className="mt-2" onClick={() =>{
                //@ts-ignore
                    window.electronAPI.handleOpenProvirder("google");
                }}>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="text-current h-5 w-5 opacity-90">
                    <path d="M12.48 10.92v3.28h7.84a6.95 6.95 0 0 1-1.79 4.13 8.03 8.03 0 0 1-6.05 2.4c-4.83 0-8.6-3.89-8.6-8.72a8.6 8.6 0 0 1 14.5-6.37l2.31-2.3A11.33 11.33 0 0 0 12.48 0C5.87 0 .31 5.39.31 12s5.56 12 12.17 12c3.57 0 6.27-1.17 8.37-3.36 2.16-2.16 2.84-5.21 2.84-7.67 0-.76-.05-1.46-.17-2.05H12.48z"></path>
                </svg>
                Войти с помощью Google
            </Button>
            <Button variant="ghost" className="mt-2" onClick={() => {
                //@ts-ignore
                window.electronAPI.handleOpenProvirder("yandex");
            }}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
            <path d="M2.04 12c0-5.523 4.476-10 10-10 5.522 0 10 4.477 10 10s-4.478 10-10 10c-5.524 0-10-4.477-10-10z" fill="#FC3F1D"/>
            <path d="M13.32 7.666h-.924c-1.694 0-2.585.858-2.585 2.123 0 1.43.616 2.1 1.881 2.959l1.045.704-3.003 4.487H7.49l2.695-4.014c-1.55-1.111-2.42-2.19-2.42-4.015 0-2.288 1.595-3.85 4.62-3.85h3.003v11.868H13.32V7.666z" fill="#fff"/>
            </svg>
                Войти с помощью Yandex ID
            </Button>
        </div>
    )
}