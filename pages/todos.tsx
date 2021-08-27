import { LoginRequired } from '@/components/auth'
import { Card } from '@/components/Card'
import { Modal } from '@/components/Modal'
import { TodoForm } from '@/components/TodoForm'
import { useTodos } from '@/store/todos'
import { onAuthUIStateChange } from '@aws-amplify/ui-components'
import { useEffect, useState } from 'react'

const Todos = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const { todos } = useTodos()

  return (
    <>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.name}</li>
        ))}
      </ul>
      <Modal
        isOpen={modalIsOpen}
        activator={
          <button onClick={() => setModalIsOpen(true)}> モーダルを開く</button>
        }
        clickOutSide={() => setModalIsOpen(true)}
      >
        <Card>
          <h1>Todoを作成する</h1>
          <TodoForm postSubmit={() => setModalIsOpen(false)} />
        </Card>
      </Modal>
    </>
  )
}

const TodoPage = () => {
  const [user, setUser] = useState<object>()

  useEffect(() => {
    // ログイン状態取得 (nextAuthState, authData)
    return onAuthUIStateChange((_, data) => {
      setUser(data)
    })
  }, [[]])

  return <LoginRequired>{user ? <Todos /> : null}</LoginRequired>
}

export default TodoPage
