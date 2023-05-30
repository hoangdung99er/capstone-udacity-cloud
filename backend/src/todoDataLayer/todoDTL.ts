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
        private readonly s3Bucket = process.env.S3_BUCKET,
        private readonly todoCreatedIndex = process.env.TODOS_CREATED_AT_INDEX
    ) {}

    async generateImage(todoId: string): Promise<string> {
        const url: string = this.s3ClientService.getSignedUrl('putObject', {
            Bucket: this.s3Bucket,
            Key: todoId,
            Expires: 99999,
        });

        return url;
    }

    async deleteToDoImpl(todoId: string, userId: string): Promise<void> {
        const params = {
            TableName: this.todosTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
        };

        await this.docClientService.delete(params).promise();
    }
    
    async createToDoImpl(item: ITodoItem): Promise<ITodoItem> {
        const params = {
            TableName: this.todosTable,
            Item: item,
        };

        await this.docClientService.put(params).promise();

        return item;
    }

    async getAllToDoList(userId: string): Promise<ITodoItem[]> {
        const result = await this.docClientService
            .query({
                TableName: this.todosTable,
                IndexName: this.todoCreatedIndex,
                KeyConditionExpression: 'userId = :pk',
                ExpressionAttributeValues: {
                ':pk': userId
                }
            })
            .promise()

        const items = result.Items as ITodoItem[]
        return items
    }

    async updateToDoItem(todoUpdate: ITodoUpdate, todoId: string, userId: string): Promise<ITodoUpdate> {
        await this.docClientService
            .update({
                TableName: this.todosTable,
                Key: {
                    todoId: todoId,
                    userId: userId
                },
                UpdateExpression:
                    'set #todo_name = :name, dueDate = :dueDate, done = :done',
                ExpressionAttributeNames: {
                    '#todo_name': 'name'
                },
                ExpressionAttributeValues: {
                    ':name': todoUpdate.name,
                    ':dueDate': todoUpdate.dueDate,
                    ':done': todoUpdate.done
                }
            })
            .promise()

        return todoUpdate;
    }
}