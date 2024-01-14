import express from 'express';
import mongoose from 'mongoose';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'

mongoose
    .connect('mongodb+srv://admin:data17@cluster0.dcvk7b9.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch(err => console.log("DB error: ", err));

const app = express();
app.use(express.json());

// auth
app.post('/auth/login', loginValidation, UserController.login);
app.post('/auth/register', registerValidation, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe)

// posts
app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, PostController.create)
app.patch('/posts/:id', checkAuth, postCreateValidation, PostController.update)
app.delete('/posts/:id', checkAuth, PostController.remove)

app.listen(4000, (err) =>
{
    if (err) {
        return console.log(err);
    }
    console.log('Server OK');
})
