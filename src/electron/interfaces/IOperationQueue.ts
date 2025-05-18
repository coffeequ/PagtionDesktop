import { Operation } from "../classes/Operation.js";
import { TypeOperations } from "../enums/TypeOperation.js";

export interface IOperationQueue{
    [TypeOperations.POST]: Operation[],
    [TypeOperations.PUT]: Operation[],
    [TypeOperations.DELETE]: Operation[]
}