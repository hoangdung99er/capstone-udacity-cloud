import { ITodoItem } from "../models/TodoItem";
import { Types } from 'aws-sdk/clients/s3';
import { ITodoUpdate } from "../models/TodoUpdate";
import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

export class TodoDTL {
    constructor(
        private readonly docClientService: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly s3ClientService: Types = new AWS.S3({ signatureVersion: 'v4' }),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly s3Bucket = process.env.S3_BUCKET) {
    }

    async generateImage(todoId: string): Promise<string> {

        const url = this.s3ClientService.getSignedUrl('putObject', {
            Bucket: this.s3Bucket,
            Key: todoId,
            Expires: 1000,
        });

        return url as string;
    }

    async deleteToDoItem(todoId: string, userId: string): Promise<void> {
        const params = {
            TableName: this.todosTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
        };

        await this.docClientService.delete(params).promise();
    }
    
    async createToDoItem(todoItem: ITodoItem): Promise<ITodoItem> {
        const params = {
            TableName: this.todosTable,
            Item: todoItem,
        };

        await this.docClientService.put(params).promise();

        return todoItem as ITodoItem;
    }

    async getAllToDoList(userId: string): Promise<ITodoItem[]> {
        const params = {
            TableName: this.todosTable,
            KeyConditionExpression: "#userId = :userId",
            ExpressionAttributeNames: {
                "#userId": "userId"
            },
            ExpressionAttributeValues: {
                ":userId": userId
            }
        };

        const result = await this.docClientService.query(params).promise();
        const items = result.Items as ITodoItem[];

        return items;
    }

    async updateToDoItem(todoUpdate: ITodoUpdate, todoId: string, userId: string): Promise<ITodoUpdate> {
        const params = {
            TableName: this.todosTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
            UpdateExpression: "set #a = :a, #b = :b, #c = :c",
            ExpressionAttributeNames: {
                "#a": "name",
                "#b": "dueDate",
                "#c": "done"
            },
            ExpressionAttributeValues: {
                ":a": todoUpdate['name'],
                ":b": todoUpdate['dueDate'],
                ":c": todoUpdate['done']
            },
            ReturnValues: "ALL_NEW"
        };

        const result = await this.docClientService.update(params).promise();
        const attributes = result.Attributes as ITodoUpdate;

        return attributes;
    }
}