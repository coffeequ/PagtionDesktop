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
import { useNavigate } from "react-router-dom"
import { FormError } from "./form-error"
import { FormSucces } from "./form-success"
import { useState, useTransition } from "react"

import useRefreshStore from "@/hooks/use-refresh"

export default function LoginForm(){

    const navigate = useNavigate();

    const triggerRefresh = useRefreshStore((state) => state.triggerRefresh);

    const [isPading, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            login: "",
        }
    });

    const handleSubmitForms = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");

        startTransition(async () => {
            const login = values.login;
            
            let item = {
                "name": login
            };

            try {
                //Сервер не работает, отключаю возможность авторизации через внешний провайдер
                window.localStorage.setItem("user", JSON.stringify(item));
                        //@ts-ignore
                        await window.electronAPI.SaveUserData(item);
                        //@ts-ignore
                        await window.electronAPI.RefreshNotesAfterLogin()
                        setSuccess("Авторизация прошла успешно!");
                        triggerRefresh();
                        navigate("/document/startPage");
                    return;
            } catch {
                setError("Упс... Произошла ошибка авторизации");
            }  
        })
    };

    return (
        <div className="flex flex-col">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmitForms)} className="space-y-6">
                    <div className="space-y-4">
                    <FormField control={form.control} name="login" render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Почта
                                </FormLabel>
                                <FormControl>
                                    <Input
                                    {...field}
                                    placeholder="login"
                                    disabled={isPading}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )} />
                        {/* Убрал запрос пароля */}
                        {/* <FormField control={form.control} name="password" render={({ field }) => (
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
                        )} /> */}
                    </div>
                    <FormError message={error}/>
                    <FormSucces message={success}/>
                    <Button type="submit" className="w-full">
                        Авторизироваться
                    </Button>
                </form>
            </Form>
        </div>
    )
}