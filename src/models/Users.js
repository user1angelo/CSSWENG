import { SchemaTypes, Schema, model } from 'mongoose';

const usersSchema = new Schema({
    email: {
        type: SchemaTypes.String,
        unique: true,
        required: true,
        validate: {
            validator: function(v) {
                return /^[\w-\.]+@gmail\.com$/.test(v);
            },
            message: props => `${props.value} is not a valid Gmail address!`
        }
    },
    password: {
        type: SchemaTypes.String,
        required: true
    },
    profilePicture: {
        type: SchemaTypes.String,
        default: '/img/default-profile.jpg' // guys, go check profile picture hehe
    },
    bio: {
        type: SchemaTypes.String,
        default: 'No bio provided, would ya like to add one?'
    },
    createdAt: {
        type: SchemaTypes.Date,
        default: Date.now
    }
}, { timestamps: true }); // This adds createdAt and updatedAt fields

const Users = model('User', usersSchema);

export default Users;