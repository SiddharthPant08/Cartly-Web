import { body } from "express-validator";


export const registerValidation =[
    body('name')
    .trim()
    .notEmpty()
    .withMessage("Name is Required")
    .isLength({min:2, max:50})
    .withMessage("Name length must be between 2 to 50 characters"),


    body('email')
    .trim()
    .notEmpty()
    .withMessage("Email is Required")
    .isEmail()
    .withMessage("Please provide a valid Email")
    .normalizeEmail(),

    body('password')
    .notEmpty("")
    .withMessage("Password is required")
    .isLength({min:6})
    .withMessage("Minimum 6 digits password is required")
]


export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];