/*

    Post.js
    Model Schema used for posts ( reviews )


*/
import { SchemaTypes, Schema, model, SchemaType } from 'mongoose';

const postSchema = new Schema({
    author: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: SchemaTypes.ObjectId,
        ref: 'Product',
        required: true
    },
    title: {
        type: SchemaTypes.String,
        required: true
    },
    content: {
        type: SchemaTypes.String,
        required: true
    },
    upvotes: [{
        type: SchemaTypes.ObjectId,
        ref: 'User'
    }],
    downvotes: [{
        type: SchemaTypes.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: SchemaTypes.ObjectId,
        ref: 'Comment'
    }],
    createdAt: {
        type: SchemaTypes.Date,
        default: Date.now
    }
});

const Post = model('Post', postSchema);
export default Post;