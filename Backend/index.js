import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import cors from 'cors';
import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';
import { UserController, PostController } from './controllers/index.js'
import dotenv from 'dotenv'

const app = express();
dotenv.config();

// constants
const PORT = process.env.PORT;
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME

mongoose
    .connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.dcvk7b9.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`)
    .then(() => console.log('DB ok'))
    .catch(err => console.log("DB error: ", err));

const storage = multer.diskStorage({
    destination: (_, __, cb) =>
    {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) =>
    {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors());

// auth
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe)

// upload
app.post('/upload', checkAuth, upload.single('image'), (req, res) =>
{
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
});

// posts
app.get('/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll)
app.get('/posts/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)
app.delete('/posts/:id', checkAuth, PostController.remove)

app.listen(PORT, (err) =>
{
    if (err) {
        return console.log(err);
    }
    console.log('Server OK');
})

