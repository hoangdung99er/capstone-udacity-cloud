/**
 * Fields in a request to update a single TODO item.
 */
export interface IUpdateTodo {
  name: string
  dueDate: string
  done: boolean
}