import { Schema, model } from 'mongoose';

const announcementSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Announcement = model('Announcement', announcementSchema);

export default Announcement;