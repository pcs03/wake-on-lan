import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    devicetype: {
        type: Number,
        required: true,
    },
    devicename: {
        type: String,
        required: true,
    },
    deviceuser: {
        type: String,
        required: true,
    },
    ip: {
        type: String,
        required: true,
    },
    mac: {
        type: String,
        required: true,
    },
});

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Please add a username'],
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
        },
        devices: [deviceSchema],
    },
    {
        timestamps: true,
    },
);

const User = mongoose.model('User', userSchema);
const Device = mongoose.model('Device', deviceSchema);

export { User, Device };
