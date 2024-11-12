import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema, model } = mongoose;
const { hash, compare } = bcrypt;


const userSchema = new Schema({
    email: {
        type: String,
        // The unique rule only works when the collection is first created
        // You cannot create a custom error message with the array syntax on the unique rule
        unique: true,
        // Ensure the value is a valid email string
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        // Ensure the string is at least 6 chars long
        minLength: [6, 'Your password must be at least 6 characters in length']
    },
    notes:[{
        type: Schema.Types.ObjectId,
        ref: 'Note'
    }]

}, {
    toJSON: {
        transform(_, user) {
            delete user.password;
            delete user.__v;

            return user;
        }
    }
});

userSchema.pre('save', async function (next) {
    const user: any = this;

    if (user.isNew) {
        user.password = await hash(user.password, 10);
    }

    next();
});

userSchema.methods.validatePassword = async function (formPassword: string) {
    return await compare(formPassword, this.password);
}

const User = model('User', userSchema);

export default User;
