import { Router } from 'express';
import Users from '../models/Users.js';
import Product from '../models/Product.js';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';

// Set up multer for file uploads || config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

const accountsRouter = Router();
/*

    accountsRouter.js should handle any request pertaining to the users' accounts...

    1. Create Account
    2. Login Verification
    3. Logout
    4. GET Profile
    5. POST Profile

    x. Create admin
    x. Admin post product thing thing choochoasdfoidp[sfasdasdasd


*/

accountsRouter.post("/create-account", async (req, res) => {
    console.log("POST request to create user received...");

    try {
        if (req.body.email === "" || req.body.password === "") {
            res.statusMessage = "Input field is empty...";
            return res.status(400).end();
        }
        if(!req.body.email.endsWith("@gmail.com")){
            res.statusMessage = "Username must be a Gmail address...";
            return res.status(400).end();
        }
        const verify = await Users.findOne({ email: req.body.email });

        if (verify) {
            res.statusMessage = "Username already exists...";
            return res.status(409).end();
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newAccount = await Users.create({
            email: req.body.email,
            password: hashedPassword
        });
        
        console.log(newAccount);
        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

accountsRouter.post("/login-verify", async (req, res) =>{
    try{
        const user = await Users.findOne({email: req.body.email});

        if (user && await bcrypt.compare(req.body.password, user.password)) {
            req.session.user = { _id: user._id, email: user.email, isAdmin: user.isAdmin }; // Make sure _id is set
            res.statusMessage = "Login Successful";
            res.status(200).end();
            console.log("SUCCESS: Login successful");
            console.log("User email:", req.body.email);
        } else {
            res.statusMessage = "Invalid email or password";
            res.status(401).end();
            console.log("ERROR: Invalid email or password");
        }

    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

accountsRouter.get("/logout", (req, res) => {
    if (req.session.user) {
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).json({ message: "Error logging out" });
            }
            res.status(200).json({ message: "Logged out successfully" });
        });
    } else {
        res.status(400).json({ message: "Not logged in, pls go back >w<" });
    }
});

// GET route for profile page
accountsRouter.get("/profile", async (req, res) => {
    if (req.session.user) {
        try {
            const user = await Users.findOne({ email: req.session.user.email });
            if (user) {
                res.render('profile', { 
                    user: {
                        email: user.email,
                        createdAt: user.createdAt ? user.createdAt.toLocaleDateString() : 'Unknown',
                        bio: user.bio,
                        profilePicture: user.profilePicture
                    }
                });
            } else {
                res.status(404).send("User not found");
            }
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    } else {
        res.redirect('/login');
    }
});

// POST route to update profile
accountsRouter.post('/profile/update', upload.single('profilePicture'), async (req, res) => {
    if (!req.session.user) return res.status(401).send('Unauthorized');
    
    try {
        const { email, bio } = req.body;
        const userUpdates = {
            email: email || req.session.user.email,
            bio: bio || req.session.user.bio
        };
        if (req.file) {
            userUpdates.profilePicture = `/uploads/${req.file.filename}`;
        }
        
        const updatedUser = await Users.findByIdAndUpdate(req.session.user._id, userUpdates, { new: true });
        
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        
        // Update session user information
        req.session.user.email = updatedUser.email;
        req.session.user.bio = updatedUser.bio;
        req.session.user.profilePicture = updatedUser.profilePicture;
        
        res.redirect('/profile');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating profile');
    }
});

// GET products page (for all users)
accountsRouter.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('products', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// =================================================================================================
/*

Admin stuff down here...

    admin@gmail.com
    ez_cssweng_4.0_grade

*/
// Middleware to check if user is admin
function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.isAdmin) {
        next();
    } else {
        res.status(403).send('Access denied');
    }
}

// GET admin products page
accountsRouter.get('/admin/products', isAdmin, async (req, res) => {
    try {
        const products = await Product.find();
        res.render('admin-products', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// POST new product
accountsRouter.post('/admin/products', isAdmin, upload.single('productImage'), async (req, res) => {
    try {
        const { productName, productPrice, productCode, productDescription } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const newProduct = new Product({
            productName,
            productPrice,
            productCode,
            productDescription,
            imageUrl
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding product' });
    }
});

// PUT update product
accountsRouter.put('/admin/products/:id', isAdmin, upload.single('productImage'), async (req, res) => {
    try {
        const { productName, productPrice, productCode, productDescription } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.currentImageUrl;

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            productName,
            productPrice,
            productCode,
            productDescription,
            imageUrl
        }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating product' });
    }
});

// DELETE product
accountsRouter.delete('/admin/products/:id', isAdmin, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting product' });
    }
});

// =================================================================================================

export default accountsRouter;