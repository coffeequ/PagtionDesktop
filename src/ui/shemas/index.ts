import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Введите почту"
    }),
    password: z.string().min(1, {
        message: "Введите пароль"
    })
});
