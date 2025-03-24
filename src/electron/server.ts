import express from "express"

const app = express();

const port: number = 5678;

app.listen(port, () => {
    console.log("сервер прослушивается на порту: ", port);
})