import {Router} from 'express';
const router = Router();
import Post from '../models/Post.js';
import Category from '../models/Category.js';


/**
 * GET /
 * Show Category List
*/
router.get('/category', async (req, res) => {
    try {
        const locals = {
            title: 'Category',
            description: 'E-sports Newsletter.'
        }

        const data = await Category.find();
        res.render('category-list', {
            locals,
            data
        });

    } catch (error) {
        console.log(error);
    }

});


// Category - Search posts by Category
router.get("/category/:id", async (req, res) => {
    try {

        let slug = req.params.id;

        const data = await Category.findById({ _id: slug });


        let searchTerm = data.title;
        // const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

        const posts = await Post.find({
            $or: [
                { category: { $regex: new RegExp(searchTerm, 'i') } }
            ]
        });

        const locals = {
            title: data.title,
            description: "E-sports Newsletter."
        }

        res.render("category", {
            data,
            locals,
            posts,
            currentRoute: '/'
        });
    } catch (error) {
        console.log(error);
    }
});

/**
 * GET /
 * Create New Category Form
*/
router.get('/add-category', async (req, res) => {
    try {
        const locals = {
            title: 'Add Category',
            description: 'E-sports Newsletter.'
        }
        res.render('add-category', {
            locals
        });

    } catch (error) {
        console.log(error);
    }

});

/**
 * POST /
 * Create New Category
*/
router.post('/add-category', async (req, res) => {
    try {
        const newCategory = new Category({
            title: req.body.title
        });

        await Category.create(newCategory);
        res.redirect('/category');
    } catch (error) {
        console.log(error);
    }

});


/**
* GET /
* Edit Category Form
*/
router.get('/edit-category/:id', async (req, res) => {
    try {

        const locals = {
            title: "Edit Category",
            description: "E-sports Newsletter.",
        };

        const data = await Category.findOne({ _id: req.params.id });

        res.render('edit-category', {
            locals,
            data
        })

    } catch (error) {
        console.log(error);
    }

});


/**
* PUT /
* Edit Post
*/
router.put('/edit-category/:id', async (req, res) => {
    try {

        await Category.findByIdAndUpdate(req.params.id, {
            title: req.body.title
        });

        res.redirect('/category');

    } catch (error) {
        console.log(error);
    }

});


/**
* DELETE /
* Delete Post
*/
router.delete('/delete-category/:id', async (req, res) => {

    try {
        const category = await Category.findById(req.params.id);        

        await Post.deleteMany({ category: category.title });
        await Category.deleteOne({ _id: req.params.id });


        res.redirect('/category');
    } catch (error) {
        console.log(error);
    }

});

export default router;