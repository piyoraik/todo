import {
  CreateTodoMutation,
  CreateTodoMutationVariables,
  TodoStatus,
} from '@/API'
import { createTodo } from '@/graphql/mutations'
import { mutate } from '@/lib/graphql'
import { useForm } from 'react-hook-form'
import styles from './TodoForm.module.scss'

type TodoFormType = {
  id?: string
  name: string
  staus: TodoStatus
  owner: string | null
}

type TodoFormProps = {
  defaultValues?: TodoFormType
  postSubmit?: () => void
}

export const TodoForm = ({ defaultValues, postSubmit }: TodoFormProps) => {
  const { handleSubmit, register, reset } = useForm<TodoFormType>({
    defaultValues: {
      ...defaultValues,
      staus: TodoStatus.NONE,
    },
  })

  const onSubmit = async ({ name, staus, id }: TodoFormType) => {
    console.log(name, staus, id)
    if (!id) {
      await mutate<CreateTodoMutation, CreateTodoMutationVariables>(
        createTodo,
        {
          input: {
            name,
            staus,
          },
        }
      )
    }
    reset()
    if (postSubmit) {
      postSubmit()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles['form']}>
      <div className={styles['field']}>
        <label className={styles['field-label']} htmlFor="name_input">
          名前
        </label>
        <input
          className={styles['field-input']}
          id="name_input"
          {...register('name', { required: true })}
        />
      </div>
      <div className={styles['field']}>
        <label className={styles['field-label']} htmlFor="status_input">
          ステータス
        </label>
        <select
          className={styles['field-select']}
          id="status_input"
          {...register('staus', { required: true })}
        >
          <option className={styles['field-select-option']} value="NONE">
            NONE
          </option>
          <option className={styles['field-select-option']} value="BACKLOG">
            BACKLOG
          </option>
          <option className={styles['field-select-option']} value="DOING">
            DOING
          </option>
          <option className={styles['field-select-option']} value="REVIEW">
            REVIEW
          </option>
          <option className={styles['field-select-option']} value="DONE">
            DONE
          </option>
        </select>
        <div className={styles['button-field']}>
          <button className={styles['button']} type="submit">
            保存
          </button>
        </div>
      </div>
    </form>
  )
}
