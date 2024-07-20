/*

    Comment.js
    Model Schema used for commenting.. duh >w<

*/
import { SchemaTypes, Schema, model } from 'mongoose';

const commentSchema = new Schema({
    author: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: SchemaTypes.String,
        required: true
    },
    post: {
        type: SchemaTypes.ObjectId,
        ref: 'Post',
        required: true
    },
    replies: [{
        type: SchemaTypes.ObjectId,
        ref: 'Comment'
    }],
    createdAt: {
        type: SchemaTypes.Date,
        default: Date.now
    }
});

const Comment = model('Comment', commentSchema);
export default Comment;