import 'source-map-support/register'

import { ICreateTodo } from '../../requests/CreateTodoReqs'
import { createToDoItem } from '../../logicHandler/todosHandler'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];

  const newTodo: ICreateTodo = JSON.parse(event.body)
  const toDoItem = await createToDoItem(newTodo, jwtToken);

  return {
    statusCode: 201,
    headers: {
        "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      todoItem: toDoItem
    }),
  }
}