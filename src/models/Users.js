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
    }
});

const Users = model('User', usersSchema);

export default Users;