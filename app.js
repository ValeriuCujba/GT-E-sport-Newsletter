import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import expressLayout from 'express-ejs-layouts';
import methodOverride from 'method-override';

import connectDB from './server/config/db.js';
import mainRouter from './server/routes/main.js';
import categoryRouter from './server/routes/category.js';
import postRouter from './server/routes/post.js';

const app = express();
const PORT = 3000 || process.env.PORT;


// Connect to Database
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(express.static('public'));

// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', mainRouter);
app.use('/', categoryRouter);
app.use('/', postRouter);


app.listen(PORT, ()=>{
    console.log(`App listening on port ${PORT}`);
})