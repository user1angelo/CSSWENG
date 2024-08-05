import { Router } from 'express';
import Users from '../models/Users.js';
import Product from '../models/Product.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

const forumRouter = Router();
/*

    forumRouter.js should handle any request related to the forums...

    1. Get post
    2. Create post
    3. Upvote
    4. Downvote
    5. Add new comment
    6. Add a reply in a comment
    6. Get single post with comments


*/

// Get all posts
forumRouter.get('/forum', async (req, res) => {
    try {
        const posts = await Post.find().populate('author product').sort('-createdAt');
        const products = await Product.find(); // Fetch all products


        res.render('forum', { posts, products }); // Pass both posts and products
        
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Create a new post
forumRouter.post('/forum/post', async (req, res) => {
    if (!req.session.user) return res.status(401).send('Unauthorized');
    
    try {
        // Log session data for debugging
        console.log("Session User:", req.session.user);

        const { productId, title, content } = req.body;
        console.log("Received data:", { productId, title, content }); // Log received data

        // Check if all required fields are present
        if (!productId || !title || !content || !req.session.user._id) {
            return res.status(400).send('All fields are required');
        }

        const post = new Post({
            author: req.session.user._id, // Set author from session
            profilePicture: req.session.user.profilePicture,
            product: productId,
            title,
            content
        });


        await post.save();
        res.redirect('/forum');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating post');
    }
});

// Upvote a post
forumRouter.post('/forum/post/:id/upvote', async (req, res) => {
    if (!req.session.user) return res.status(401).send('Unauthorized');
    console.log("Upvote request received");

    try {
        console.log("Upvote request received for post:", req.params.id);

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send('Post not found');

        if (!post.upvotes.includes(req.session.user._id)) {
            post.upvotes.push(req.session.user._id);
            post.downvotes.pull(req.session.user._id); // Remove from downvotes if exists
            await post.save();
        }
        res.send({ upvotes: post.upvotes.length, downvotes: post.downvotes.length });
    } catch (err) {
        console.error('Error upvoting post:', err);
        res.status(500).send('Error upvoting post');
    }
});

// Downvote a post
forumRouter.post('/forum/post/:id/downvote', async (req, res) => {
    if (!req.session.user) return res.status(401).send('Unauthorized');
    console.log("Downvote request received");

    try {
        console.log("Downvote request received for post:", req.params.id);

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send('Post not found');

        if (!post.downvotes.includes(req.session.user._id)) {
            post.downvotes.push(req.session.user._id);
            post.upvotes.pull(req.session.user._id); // Remove from upvotes if exists
            await post.save();
        }
        res.send({ upvotes: post.upvotes.length, downvotes: post.downvotes.length });
    } catch (err) {
        console.error('Error downvoting post:', err);
        res.status(500).send('Error downvoting post');
    }
});

//-------------------------------------------------------------------------------------------------

// Upvote a Comment
forumRouter.post('/forum/comment/:id/upvote', async (req, res) => {
    if (!req.session.user) return res.status(401).send('Unauthorized');
    console.log("Upvote request received");

    try {
        console.log("Upvote request received for post:", req.params.id);

        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).send('Post not found');

        if (!comment.upvotes.includes(req.session.user._id)) {
            comment.upvotes.push(req.session.user._id);
            comment.downvotes.pull(req.session.user._id); // Remove from downvotes if exists
            await comment.save();
        }
        res.send({ upvotes: comment.upvotes.length, downvotes: comment.downvotes.length });
    } catch (err) {
        console.error('Error upvoting comment:', err);
        res.status(500).send('Error upvoting comment');
    }
});


// Downvote a Comment
forumRouter.post('/forum/comment/:id/downvote', async (req, res) => {
    if (!req.session.user) return res.status(401).send('Unauthorized');
    console.log("Downvote request received");

    try {
        console.log("Downvote request received for post:", req.params.id);

        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).send('Post not found');

        if (!comment.downvotes.includes(req.session.user._id)) {
            comment.downvotes.push(req.session.user._id);
            comment.upvotes.pull(req.session.user._id); // Remove from upvotes if exists
            await comment.save();
        }
        res.send({ upvotes: comment.upvotes.length, downvotes: comment.downvotes.length });
    } catch (err) {
        console.error('Error downvoting comment:', err);
        res.status(500).send('Error downvoting comment');
    }
});



// Add a comment
forumRouter.post('/forum/post/:id/comment', async (req, res) => {
    if (!req.session.user) return res.status(401).send('Unauthorized');
    
    try {
        const comment = new Comment({
            author: req.session.user._id,
            content: req.body.content,
            post: req.params.id
        });
        await comment.save();
        
        const post = await Post.findById(req.params.id);
        post.comments.push(comment._id);
        await post.save();
        
        res.redirect(`/forum/post/${req.params.id}`);
    } catch (err) {
        res.status(500).send('Error adding comment');
    }
});

// Add a reply to a comment
forumRouter.post('/forum/post/:postId/comment/:commentId/reply', async (req, res) => {
    if (!req.session.user) return res.status(401).send('Unauthorized');

    try {
        const reply = new Comment({
            author: req.session.user._id,
            profilePicture: req.session.profilePicture,
            content: req.body.content,
            post: req.params.postId
        });
        await reply.save();
        
        // Update the original comment with this reply
        const comment = await Comment.findById(req.params.commentId);
        comment.replies.push(reply._id);
        await comment.save();

        res.redirect(`/forum/post/${req.params.postId}`);
    } catch (err) {
        res.status(500).send('Error adding reply');
    }
});

// Get a single post with comments
forumRouter.get('/forum/post/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'email profilePicture' 
                }
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'replies',
                    populate: {
                        path: 'author',
                        select: 'email profilePicture'
                    }
                }
            })
            .populate('author', 'email profilePicture')
            .populate('product', 'productName');

        if (!post) return res.status(404).send('Post not found');

        res.render('post', { post, session: req.session });
    } catch (err) {
        res.status(500).send('Error fetching post');
    }
});


// Edit Post Content
forumRouter.put('/forum/post/update/:id', async (req,res) =>{
    try{
        const updated = req.body.content;
        const post = await Post.findById(req.params.id).updateOne({$set: {content: updated}})

        if (!post) return res.status(404).send('Post not found');

        res.json({message: 'Post Updated Successfully'});
    }catch (err){
        res.status(500).send('Error editing Post')
    }
})


export default forumRouter;