const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Category = require('../models/Category');

// Routes
// GET HOme Page
router.get("", async (req, res) => {

    try {

        const locals = {
            title: "E-sports News",
            description: "E-sports News in Node.js, Express and MongoDB"
        }

        let perPage = 3;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await Post.count();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
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

// Post - Search post
router.post("/search", async (req, res) => {
    try {
        const locals = {
            title: "Seach",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
            ]
        });

        res.render("search", {
            data,
            locals,
            currentRoute: '/'
        });
    } catch (error) {
        console.log(error);
    }
});

/**
 * GET /
 * Show Dashboard
*/
router.get('/dashboard', async (req, res) => {
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
        res.redirect('/dashboard');
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
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }

});


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
        console.log(category);

        await Post.deleteMany({ category: category.title });
        await Category.deleteOne({ _id: req.params.id });


        res.redirect('/category');
    } catch (error) {
        console.log(error);
    }

});

// function insertPostData () {
//   Category.insertMany([
//     {     
//         title: "League of Legends"
//     },
//     {
//       title: "CS:GO"

//     },
//     {
//       title: "Dota 2"      
//     }    
//   ])
// }

//  insertPostData();




module.exports = router;