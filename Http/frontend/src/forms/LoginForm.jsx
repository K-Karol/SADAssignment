import { useState } from 'react';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
import PropTypes from 'prop-types';

// Will pretty this up with Material in SAD-005 commit.
// Remove email validation as no longer needed.
// Replace with validation for usernames
// Fix boxes being different sizes

async function userLogin(credentials) {
  return fetch(`${window.location.origin}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
}
export default function LoginForm({ setToken})
{
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  // store token in local storage if it isn't already
  const handleSubmit = async e => {
    e.preventDefault();
    const token = await userLogin({
      username,
      password
    });
    setToken(token);
  }
  // const logout = () => {
  //   localStorage.removeItem('token-info');
  //   setToken(false);
  // };

    return (
        <div>
        <h2>Please enter your organisation username and password to access the attendance system.</h2>
        <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" onChange={e => setUserName(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={e => setPassword(e.target.value)} />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
        {/* <div>
          <button type="logout" onClick={logout}>Logout</button>
        </div> */}
      </form>
        </div>
    )
}
         {/* <Formik
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
          // onSubmit={(values, { setSubmitting }) => {
          //   // setTimeout(() => {
          //   //   alert(JSON.stringify("Login successful", null, 2));
          //   //   setSubmitting(false);
          //   // }, 400);
          // }}
        //   onSubmit={(handleSubmit)}
        // > */}
        //   {({ isSubmitting }) => (
        //     <Form>
        //       <Field type="text" name="email" onChange={e => setUserName(e.target.value)}/>
        //       <ErrorMessage name="email" component="div" />
        //       <Field type="password" name="password" onChange={e => setPassword(e.target.value)}/>
        //       {/* style this - password style is what's separating them */}
        //       <ErrorMessage name="password" component="div" />
        //       <button type="submit">
        //         Login
        //       </button>
        //     </Form>
        //   )}
        {/* </Formik> */}
LoginForm.propTypes = {
  setToken: PropTypes.func.isRequired
}