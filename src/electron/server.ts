import express from "express"
import { db, InitTable } from "./src/classes/db.js";

const api = express();

const port: number = 5678;

api.use(express.json());

api.post("/test", async (req, res) => {
    
    try {
        res.status(200).json({
            status: "success",
            data: {
                message: "Тест отрпавки запроса"
            }
        });
    } catch (error) {
        console.log("Ошибка ошибка авторизации");
    }
})

export function startServer(){
    InitTable();
    api.listen(port, "127.0.0.1", () => {
        console.log("server started in:", port);
    });
}