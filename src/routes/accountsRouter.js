import { Router } from 'express';
import Users from '../models/Users.js';

const accountsRouter = Router();
/*

    accountsRouter.js should handle any request pertaining to the users' accounts...

    1. Creat Account
    2. Login Verification
    3. Logout
    4. Profile


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

        const newAccount = await Users.create({
            email: req.body.email,
            password: req.body.password
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
        const verify = await Users.findOne({email: req.body.email});

        if (verify && verify.password === req.body.password) {
            req.session.user = { email: verify.email };
            res.statusMessage = "Login Successful";
            res.status(200).end();
            console.log("SUCCESS: Login successful");
            console.log("User email:", req.body.email);
        }else{
            res.statusMessage = "Password is incorrect";
            res.status(500).end;
            console.log("ERROR: Incorrect Password");
            
        }

    }catch(err){
        res.statusMessage = "Username does not exist";
        res.status(500).end();
        console.log("ERROR: Username Does not Exist");
        
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

// Placeholder route for profile page
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

export default accountsRouter;