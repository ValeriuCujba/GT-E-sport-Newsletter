import {Router} from 'express';
const router = Router();
import Post from '../models/Post.js';
import Category from '../models/Category.js';




/**
 * GET /
 * Show Dashboard
*/
router.get('/posts', async (req, res) => {
    try {
        const locals = {
            title: 'Dashboard',
            description: 'Simple Blog created with NodeJs, Express & MongoDb.'
        }

        const data = await Post.find();
        res.render('dashboard', {
            locals,
            data
        });

    } catch (error) {
        console.log(error);
    }

});


// GET Post by ID
router.get("/post/:id", async (req, res) => {
    try {

        let slug = req.params.id;
        const data = await Post.findById({ _id: slug });


        const locals = {
            title: data.title,
            description: "E-sports News in Node.js, Express and MongoDB"
        }
        res.render('post', { locals, data });
    } catch (error) {
        console.log(error);
    }
});

/**
 * GET /
 * Create New Post Form
*/
router.get('/add-post', async (req, res) => {
    try {

        const data = await Category.find();
        const categoryId = req.query.categoryId;
        let categoryTitle = '';
        if (categoryId !== undefined) {
            const category = await Category.findById(categoryId);
            categoryTitle = category.title;
        }
        const locals = {
            title: 'Add Post',
            description: 'Simple Blog created with NodeJs, Express & MongoDb.'
        }


        res.render('add-post', {
            locals,
            data,
            categoryTitle
        });

    } catch (error) {
        console.log(error);
    }

});

/**
 * POST /
 * Create New Post
*/
router.post('/add-post', async (req, res) => {

    try {
        const newPost = new Post({
            title: req.body.title,
            body: req.body.body,
            category: req.body.category
        });

        await Post.create(newPost);
        res.redirect('/posts');
    } catch (error) {
        console.log(error);
    }

});


/**
* GET /
* Edit New Post Form
*/
router.get('/edit-post/:id', async (req, res) => {
    try {

        const locals = {
            title: "Edit Post",
            description: "NodeJs App",
        };

        const data = await Post.findOne({ _id: req.params.id });
        const categories = await Category.find();

        res.render('edit-post', {
            locals,
            data,
            categories
        })

    } catch (error) {
        console.log(error);
    }

});

/**
* PUT /
* Edit - update Post
*/
router.put('/edit-post/:id', async (req, res) => {
    try {

        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            category: req.body.category,
            updatedAt: Date.now()
        });

        res.redirect('/post/' + req.params.id);

    } catch (error) {
        console.log(error);
    }

});

/**
* DELETE /
* Delete Post
*/
router.delete('/delete-post/:id', async (req, res) => {

    try {
        await Post.deleteOne({ _id: req.params.id });
        res.redirect('/posts');
    } catch (error) {
        console.log(error);
    }

});

export default router;