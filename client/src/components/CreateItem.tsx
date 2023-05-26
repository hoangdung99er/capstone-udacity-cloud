import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  GridRow
} from 'semantic-ui-react'

import { createTodo, deleteTodo, getTodos, patchTodo } from '../api/todos-api'
import Auth from '../auth/Auth'
import { Todo } from '../types/Todo'

interface ShoppingProps {
  auth: Auth
  history: History
}

interface ShoppingState {
  todos: Todo[]
  newTodoName: string
  loadingTodos: boolean
}

export class CreateItem extends React.PureComponent<ShoppingProps, ShoppingState> {
  state: ShoppingState = {
    todos: [],
    newTodoName: '',
    loadingTodos: true
  }

  onTodoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    // try {
    //   const dueDate = this.calculateDueDate()
    //   const newTodo = await createTodo(this.props.auth.getIdToken(), {
    //     name: this.state.newTodoName,
    //     dueDate
    //   })
    //   this.setState({
    //     todos: [...this.state.todos, newTodo],
    //     newTodoName: ''
    //   })
    // } catch {
    //   alert('Todo creation failed')
    // }
    this.props.history.push(`/create`)
  }

  render() {
    return (
      <div>
        <Header as="h1">DD Shopping</Header>

        {this.renderCreateTodoInput()}

        {this.renderTodos()}
      </div>
    )
  }

  renderCreateTodoInput() {
    return (
      <>
      <Grid.Row>
        
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'Create Shopping Item',
              onClick: this.onTodoCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Search Item..."
            // onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
      </>
    )
  }

  renderTodos() {
    return this.renderTodosList()
  }

  renderTodosList() {
    return (
      <Grid padded>
        <Grid.Column>
            <Grid.Column>
                Name
            <Input
                fluid
                actionPosition="left"
                placeholder="Search Item..."
            />
            </Grid.Column>
            <Grid.Column>
            </Grid.Column>
            <Grid.Column>
            </Grid.Column>
        </Grid.Column>
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
