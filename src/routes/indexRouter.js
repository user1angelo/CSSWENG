import { Router } from 'express';
import Post from '../models/Post.js';
import Product from '../models/Product.js';
import Announcement from '../models/Announcement.js';
import accountsRouter from './accountsRouter.js';
import forumRouter from './forumRouter.js';

const indexRouter = Router();

indexRouter.get('/', async (req, res) => {
    try {
        const featuredProducts = await Product.find().limit(3);
        const announcements = await Announcement.find().sort('-createdAt');
        const isAdmin = req.session.user && req.session.user.isAdmin;

        res.render('index', {
            title: "Index Page",
            featuredProducts,
            announcements,
            isAdmin
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// POST create announcement
indexRouter.post('/create-announcement', async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.isAdmin) {
            return res.status(403).send('Forbidden');
        }

        const { title, body } = req.body;
        const newAnnouncement = new Announcement({
            title,
            body,
            createdAt: new Date()
        });

        await newAnnouncement.save();
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

indexRouter.get('/about', (req,res) => {
    res.render("about", {
        title: "About Page"
    });
})

indexRouter.get('/contact', (req,res) => {
    res.render("contact", {
        title: "Contacts Page"
    });
})

// =================================================================================================
// GET products page (for all users)
indexRouter.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('products', { products, title: "Products Page" });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

indexRouter.get('/product-details/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.json(product); // Return product data as JSON for the modal
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});
// =================================================================================================

// GET forum page
indexRouter.get('/forum', async (req, res) => {
    try {
        const products = await Product.find(); // Fetch products here
        const posts = await Post.find().populate('author product').sort('-createdAt');
        res.render('forum', { posts, products, title: "Forum Page" });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

indexRouter.get('/signup', (req,res)=>{
    res.render("signup", {
        title: "Signup Page"
    });
})

indexRouter.get('/login', (req,res)=>{
    res.render("login", {
        title: "Login Page"
    });
})

indexRouter.use(accountsRouter);
indexRouter.use(forumRouter);

export default indexRouter;