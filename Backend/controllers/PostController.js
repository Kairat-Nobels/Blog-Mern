import PostModel from '../models/Post.js'

export const getLastTags = async (req, res) =>
{
    try {
        const posts = await PostModel.find().exec();

        const allTags = posts
            .map((obj) => obj.tags)
            .flat();

        const uniqueTags = [...new Set(allTags)].slice(0, 5);

        res.json(uniqueTags);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить тэги',
        });
    }
};

export const getAll = async (req, res) =>
{
    try {
        const posts = await PostModel.find().populate('user').sort({ createdAt: -1 }).exec();
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};
export const getPopular = async (req, res) =>
{
    try {
        const posts = await PostModel.find().populate('user').sort({ viewsCount: -1 }).exec();
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить популярные статьи',
        });
    }
};
export const getOne = async (req, res) =>
{
    try {
        const postId = req.params.id;

        const doc = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { returnDocument: 'after' }
        ).populate('user');

        if (!doc) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        res.json(doc);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статью',
        });
    }
};

export const remove = async (req, res) =>
{
    try {
        const postId = req.params.id;

        const doc = await PostModel.findOneAndDelete({ _id: postId });
        if (!doc) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить статью',
        });
    }
};

export const create = async (req, res) =>
{
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статью',
        });
    }
};

export const update = async (req, res) =>
{
    try {
        const postId = req.params.id;

        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
                tags: req.body.tags.split(','),
            },
        );

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить статью',
        });
    }
};

export const addComment = async (req, res) =>
{
    try {
        const postId = req.params.id;

        const doc = await PostModel.findOneAndUpdate(
            {
                _id: postId // find an element by ID;
            },
            {   // HERE we indicated WHAT we're trying to update:
                comments: req.body.comments,
                fullName: req.body.comments.fullName,
                avatarUrl: req.body.comments.avatarUrl,
                text: req.body.text
            },

            {
                returnDocument: 'after' // return the UPDATED document;
            }
        );

        if (!doc) {
            res.status(404).json({
                message: "No such post found for adding the comment!"
            });
        }

        res.json({ 'success': true });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Was not able to EDIT this post!"
        });
    }
}