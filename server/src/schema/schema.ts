import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
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

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    devices: [deviceSchema],
});

const User = mongoose.model('User', userSchema);
const Device = mongoose.model('Device', deviceSchema);

export { User, Device };
