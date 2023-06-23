import {Router} from 'express';
const router = Router();
import Post from '../models/Post.js';
import Category from '../models/Category.js';

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



export default router;