import 'source-map-support/register'

import { updateToDoItem } from '../../logicHandler/todosHandler'
import { IUpdateTodo } from '../../requests/UpdateTodoReqs'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'



export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];

  const todoId = event.pathParameters.todoId;
  const updatedTodo: IUpdateTodo = JSON.parse(event.body);

  const toDoItem = await updateToDoItem(updatedTodo, todoId, jwtToken);

  return {
    statusCode: 204,
    headers: {
        "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
        todoItem: toDoItem,
        message: "Updated successful todo item"
    }),
  }
}