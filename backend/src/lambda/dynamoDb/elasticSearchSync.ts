import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda'
import 'source-map-support/register'
import * as elasticsearch from 'elasticsearch'
import * as httpAwsEs from 'http-aws-es'

const esHost = process.env.ES_ENDPOINT

const es = new elasticsearch.Client({
  hosts: [ esHost ],
  connectionClass: httpAwsEs
})

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
  for (const record of event.Records) {
    switch (record.eventName) {
      case "INSERT":
        const newItem = record.dynamodb.NewImage

        const body = {
          userId: newItem.userId.S,
          todoId: newItem.todoId.S,
          name: newItem.name.S,
          done: newItem.done.S,
          createdAt: newItem.createdAt.S,
          dueDate: newItem.dueDate.S
        }

        await es.index({
          index: 'todos-index',
          type: 'todos',
          id: newItem.todoId.S,
          body
        })
        break;
      
      case "MODIFY":
        const updated = record.dynamodb.NewImage;
      
        const updatedBody = {
          userId: updated.userId.S,
          todoId: updated.todoId.S,
          name: updated.name.S,
          done: updated.done.S,
          createdAt: updated.createdAt.S,
          dueDate: updated.dueDate.S,
          attachmentUrl: updated.attachmentUrl.S
        }

        await es.update({
          index: 'todos-index',
          type: 'todos',
          id: updated.todoId.S,
          body: { updatedBody }
        })
        break;
      default:
        break;
    }
  }
}