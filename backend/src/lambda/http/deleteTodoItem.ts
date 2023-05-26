import 'source-map-support/register'

import { deleteToDoItem } from '../../logicHandler/todosHandler'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];

  const todoId = event.pathParameters.todoId;

  await deleteToDoItem(todoId, jwtToken);
  
  return {
    statusCode: 204,
    headers: {
        "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      message: "Successful Deleted Todo Item"
    })
  }
}


