import { Formik } from 'formik';
import * as Yup from 'yup';
import { CREATE_TODO, GET_TODOS } from '../../../../gql';
import { useMutation } from '@apollo/client';
import { decodeToken, getToken } from '../../../../utils/auth';
import { toast } from 'react-toastify';
import './TodoForm.scss';

const initialValues = {
  title: '',
  comment: '',
  completed: false,
};

const schema = new Yup.ObjectSchema({
  title: Yup.string().min(4).max(100).required(),
  comment: Yup.string().min(4).max(300),
  completed: Yup.boolean().required(),
});

export default function TodoForm() {
  const [createTodo] = useMutation(CREATE_TODO, {
    update(cache, { data: createTodo }) {
      const { getTodos } = cache.readQuery({
        query: GET_TODOS,
      });

      cache.writeQuery({
        query: GET_TODOS,
        data: {
          getTodos: { ...getTodos },
        },
      });
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={async (values, { resetForm }) => {
        const token = getToken();
        const user = decodeToken(token.replace('Bearer ', ''));

        const { data } = await createTodo({
          variables: {
            todo: {
              ...values,
              userID: user.payload.id,
              title: values.title.trim(),
              comment: values.comment.trim() || '...',
            },
          },
        });

        if (data.createTodo.success) {
          toast.success('The task has been created successfully');
        } else {
          toast.error('Task could not be created');
        }
        resetForm();
      }}
    >
      {({ values, handleChange, handleSubmit }) => (
        <form id='todo-form' onSubmit={handleSubmit}>
          <input
            type='text'
            name='title'
            placeholder='title'
            onChange={handleChange}
            value={values.title}
            minLength={4}
            maxLength={100}
            autoComplete='off'
          />
          <input
            type='text'
            name='comment'
            placeholder='comment'
            onChange={handleChange}
            value={values.comment}
            minLength={4}
            maxLength={300}
            autoComplete='off'
          />

          <button className='btn' type='submit'>
            Add
          </button>
        </form>
      )}
    </Formik>
  );
}
