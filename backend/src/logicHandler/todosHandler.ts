import {parseUserId} from "../auth/utils";
import {IUpdateTodo} from "../requests/UpdateTodoReqs";
import {ICreateTodo} from "../requests/CreateTodoReqs";
import {TodoDTL} from "../todoDataLayer/todoDTL";
import {ITodoItem} from "../models/TodoItem";
import {ITodoUpdate} from "../models/TodoUpdate";

const uuidv4 = require('uuid/v4');
const toDoDTL = new TodoDTL();

export function generateImage(todoId: string): Promise<string> {
    return toDoDTL.generateImage(todoId);
}

export function deleteToDoItem(todoId: string, jwtToken: string): Promise<void> {
    const userId = parseUserId(jwtToken);
    return toDoDTL.deleteToDoImpl(todoId, userId);
}

export function updateToDoItem(updateTodo: IUpdateTodo, todoId: string, jwtToken: string): Promise<ITodoUpdate> {
    const userId = parseUserId(jwtToken);
    return toDoDTL.updateToDoItem(updateTodo, todoId, userId);
}

export async function getAllToDoList(jwtToken: string): Promise<ITodoItem[]> {
    const userId = parseUserId(jwtToken);
    return toDoDTL.getAllToDoList(userId);
}

export function createToDoItem(todo: ICreateTodo, jwtToken: string): Promise<ITodoItem> {
    const todoId =  uuidv4();
    const userId = parseUserId(jwtToken);
    const s3Bucket = process.env.S3_BUCKET;
    
    return toDoDTL.createToDoImpl({
        userId: userId,
        todoId: todoId,
        attachmentUrl:  `https://${s3Bucket}.s3.amazonaws.com/${todoId}`, 
        createdAt: new Date().getTime().toString(),
        done: false,
        ...todo,
    });
}
