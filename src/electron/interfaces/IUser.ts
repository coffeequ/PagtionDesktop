import { Note } from "../classes/Note.js";

export interface IUser {
    id: string,
    email: string,
    name: string,
    image: string | null,
    documents?: Note[]
}