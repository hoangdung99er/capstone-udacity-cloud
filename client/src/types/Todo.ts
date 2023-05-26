export interface Todo {
  todoId: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}

export interface Hits {
  _id: string
  _index: string
  _score: number
  _source: Todo
  _type: string
}
