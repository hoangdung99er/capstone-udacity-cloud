import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { generateImage } from '../../logicHandler/todosHandler'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const imageUrl = await generateImage(todoId);

  return {
    statusCode: 201,
    headers: {
        "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      imageUrl: imageUrl,
    })
  };
}

