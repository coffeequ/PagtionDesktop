import * as z from "zod";

export const LoginSchema = z.object({
    login: z.string({
        message: "Введите логин"
    })
});
