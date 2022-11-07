import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button } from '@mui/material'
import { Link } from 'react-router-dom';
// Will pretty this up with Material in SAD-005 commit.
export default function RegistrationForm()
{
    return (
        <div>
        <Link to="/">
            <Button variant ="contained"> Home</Button>
        </Link>
        <h2>Please enter your username and password to access the attendance system.</h2>
        <Formik
          initialValues={{ email: '', password: '' }}
          validate={values => {
            const errors = {};
            if (!values.email) {
              errors.email = 'Required';
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = 'Invalid email address';
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 400);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" />
              <Field type="password" name="password" />
              <ErrorMessage name="password" component="div" />
              <button type="submit" disabled={isSubmitting}>
                Login
              </button>
            </Form>
          )}
        </Formik>
      </div>
    )
}