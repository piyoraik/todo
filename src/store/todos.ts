import {
  ListTodosQuery,
  OnCreateTodoSubscription,
  OnDeleteTodoSubscription,
  OnUpdateTodoSubscription,
} from '@/API'
import { listTodos } from '@/graphql/queries'
import {
  onCreateTodo,
  onUpdateTodo,
  onDeleteTodo,
} from '@/graphql/subscriptions'
import { noNull } from '@/lib/filter'
import { query, subscription } from '@/lib/graphql'
import { Todo } from '@/models/todo'
import { configure } from '@/my-aws-exports'
import { useEffect, useState } from 'react'

configure()

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([])

  const addTodo = (todo: Todo) => {
    setTodos((todos) => [...todos, todo])
  }

  const updateTodo = (todo: Todo) => {
    setTodos((todos) => {
      const idx = todos.findIndex((item) => item.id === todo.id)
      if (idx !== -1) {
        todos[idx] = todo
      }
      return [...todos]
    })
  }

  const deleteTodo = (todo: Todo) => {
    setTodos((todos) => {
      const idx = todos.findIndex((item) => item.id === todo.id)
      if (idx !== -1) {
        todos.splice(idx, 1)
      }
      return [...todos]
    })
  }

  useEffect(() => {
    query<ListTodosQuery>(listTodos).then((result) => {
      if (result.data?.listTodos?.items) {
        setTodos([...todos, ...result.data.listTodos.items.filter(noNull)])
      }
    })

    const onCreate = subscription<OnCreateTodoSubscription>(
      onCreateTodo
    ).subscribe({
      next: ({
        value: {
          data: { onCreateTodo },
        },
      }) => {
        if (onCreateTodo) {
          addTodo(onCreateTodo)
        }
      },
    })

    const onUpdate = subscription<OnUpdateTodoSubscription>(
      onUpdateTodo
    ).subscribe({
      next: ({
        value: {
          data: { onUpdateTodo },
        },
      }) => {
        if (onUpdateTodo) {
          updateTodo(onUpdateTodo)
        }
      },
    })

    const onDelete = subscription<OnDeleteTodoSubscription>(
      onDeleteTodo
    ).subscribe({
      next: ({
        value: {
          data: { onDeleteTodo },
        },
      }) => {
        if (onDeleteTodo) {
          deleteTodo(onDeleteTodo)
        }
      },
    })

    return () => {
      onCreate.unsubscribe()
      onUpdate.unsubscribe()
      onDelete.unsubscribe()
    }
  }, [])

  return {
    todos,
  }
}
