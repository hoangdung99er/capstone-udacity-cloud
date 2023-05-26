import { apiEndpoint, esApiEndpoint } from '../config'
import { Todo, Hits } from '../types/Todo';
import { CreateTodoRequest } from '../types/CreateTodoRequest';
import Axios from 'axios'
import { UpdateTodoRequest } from '../types/UpdateTodoRequest';

export async function getTodos(): Promise<Todo[]> {
  const response = await Axios.get(`${esApiEndpoint}/todos-index/_search`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const listItem: Todo[] = []
  response.data.hits.hits.forEach((item: Hits) => {
    listItem.push(item._source)
  })
  return listItem
}

export async function getTodo(todoId: string): Promise<string> {
  const response = await Axios.get(`${esApiEndpoint}/todos-index/_search?q=todoId:${todoId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response.data.hits.hits[0]._id
}

export async function createTodo(
  idToken: string,
  newTodo: CreateTodoRequest
): Promise<Todo> {
  const response = await Axios.post(`${apiEndpoint}/todos`,  JSON.stringify(newTodo), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.todoItem
}

export async function createTodoEs(
  newTodo: CreateTodoRequest
): Promise<Todo> {
  const response = await Axios.post(`${esApiEndpoint}/todos-index/todos`,  JSON.stringify(newTodo), {
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return response.data.result
}

export async function patchTodo(
  idToken: string,
  todoId: string,
  updatedTodo: UpdateTodoRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/todos/${todoId}`, JSON.stringify(updatedTodo), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteTodo(
  idToken: string,
  todoId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/todos/${todoId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteTodoEs(
  todoId: string
): Promise<void> {
  await Axios.delete(`${esApiEndpoint}/todos-index/todos/${todoId}`, {
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

export async function searchTodo(
  todoName: string
): Promise<Todo[]> {
  const response = await Axios.get(`${esApiEndpoint}/todos-index/_search${!todoName ? '' : `?q=name:${todoName}`}`, {
    headers: {
      'Content-Type': 'application/json',
    }
  })

  const listItem: Todo[] = []
  response.data.hits.hits.forEach((item: Hits) => {
    listItem.push(item._source)
  })
  return listItem
}

export async function getUploadUrl(
  idToken: string,
  todoId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/todos/${todoId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.imageUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
