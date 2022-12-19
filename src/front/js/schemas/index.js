import * as Yup from 'yup'


const emailRules = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;



export const signupSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email')
        .required('Email is required')
        .matches(emailRules, 'Email is invalid'),
    confirmEmail: Yup.string()
        .email('Invalid email')
        .required('Email confirmation is required')
        .oneOf([Yup.ref('email'), null], 'Email does not match'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required')
        .matches(passwordRules, 'Password is invalid'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Password confirmation is required'),
    userName: Yup.string()
        .required('Username is required'),
    confirmUsername: Yup.string()
        .oneOf([Yup.ref('userName'), null], 'Usernames must match')
        .required('Username confirmation is required'),
});


export const loginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email')
        .required('Email is required')
        .matches (emailRules, 'Email is invalid'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required')
        .matches(passwordRules, 'Password is invalid'),
});

export const todoListSchema = Yup.object().shape({
    name: Yup.string()
        .required('Name is required'),
    description: Yup.string()
        .required('Description is required')
});