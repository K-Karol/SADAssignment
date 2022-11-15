import { Formik, Form, Field, ErrorMessage } from 'formik';
// Will pretty this up with Material in SAD-005 commit.
// Remove email validation as no longer needed.
// Replace with validation for usernames
// Fix boxes being different sizes
export default function LoginForm()
{
    return (
        <div>
        <h2>Please enter your organisation username and password to access the attendance system.</h2>
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
          // prev set alert to values: however we don't want to display that info
          // the user can see their username but not their password - we don't want them to see sensitive information
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify("Login successful", null, 2));
              setSubmitting(false);
            }, 400);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field type="text" name="email" />
              <ErrorMessage name="email" component="div" />
              <Field type="password" name="password" />
              {/* style this - password style is what's separating them */}
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