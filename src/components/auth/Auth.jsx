import { useContext, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@apollo/client';
import { CREATE_USER, SEARCH_USER } from '../../../gql';
import { toast } from 'react-toastify';
import Container from '../Container';
import { setToken } from '../../../utils/auth';
import UserContext from '../../context/UserContext';
import './Auth.scss';

const initialValues = {
  username: '',
  password: '',
};

const schema = new Yup.ObjectSchema({
  username: Yup.string().min(4).max(25).required(),
  password: Yup.string().min(8).max(25).required(),
});

export default function Auth() {
  const [type, setType] = useState(false);
  const { currentUser } = useContext(UserContext);
  const [searchUser] = useMutation(SEARCH_USER);
  const [createUser] = useMutation(CREATE_USER);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={async (values, { resetForm }) => {
        if (type) {
          try {
            const { data } = await searchUser({
              variables: {
                user: {
                  username: values.username.trim(),
                  password: values.password.trim(),
                },
              },
            });
            setToken(data.searchUser.token);
            currentUser(data.searchUser.token);
            toast.success(`Welcome ${values.username}`);
          } catch (error) {
            console.error(error);
            toast.error('Username or Password is invalid');
          }
        } else {
          const { data } = await createUser({
            variables: {
              user: {
                username: values.username.trim(),
                password: values.password.trim(),
              },
            },
          });
          setToken(data.createUser.token);
          currentUser(data.createUser.token);
          toast.success(`Welcome ${values.username}`);
          try {
          } catch (error) {
            toast.error(error.message);
          }
        }

        resetForm();
      }}
    >
      {({ values, handleChange, handleSubmit }) => (
        <Container>
          <Form id='auth-form' onSubmit={handleSubmit}>
            <h2>{type ? 'Login' : 'Register'}</h2>
            <Field
              type='text'
              name='username'
              onChange={handleChange}
              value={values.username}
              placeholder='username'
              minLength={4}
              maxLength={25}
              autoComplete='off'
            />
            <Field
              type='password'
              name='password'
              onChange={handleChange}
              value={values.password}
              placeholder='password'
              minLength={8}
              maxLength={25}
              autoComplete='off'
            />
            <span>
              <button className='btn' type='submit'>
                Send
              </button>

              <small id='form-type' onClick={() => setType(!type)}>
                {type ? 'Register' : 'Login'}
              </small>
            </span>
          </Form>
        </Container>
      )}
    </Formik>
  );
}
