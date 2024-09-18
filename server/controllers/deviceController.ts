import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import { User, Device } from './../schema/schema';
import { SafeUserDocument } from '../../types/custom';
import { regex } from './../../shared/constants';

const getDevices = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        res.status(401);
        next(new Error('No user given'));
        return;
    }

    console.log(req.user);

    const { _id } = (await User.findById(req.user._id)) as SafeUserDocument;

    if (!_id) {
        res.status(401);
        next(new Error('No user id found'));
        return;
    }

    const devices = await Device.find({ userid: _id });

    res.status(200).json(devices);
};

const getDeviceById = async (req: Request, res: Response, next: NextFunction) => {
    const deviceId = req.params.id;

    if (!req.user) {
        res.status(401);
        next(new Error('No user given'));
        return;
    }

    const user = (await User.findById(req.user._id)) as SafeUserDocument;
    const userid = user._id;

    if (!userid) {
        res.status(401);
        next(new Error('No user id found'));
        return;
    }

    const device = await Device.findById(deviceId);

    if (!device) {
        res.status(400);
        next(new Error(`No device found for id ${deviceId}`));
        return;
    }

    if (device.userid.toString() !== userid.toString()) {
        res.status(401);
        next(new Error('Not authorized'));
        return;
    }

    res.status(200).json(device);
};

const createDevice = async (req: Request, res: Response, next: NextFunction) => {
    const { devicename, deviceuser, ip, mac, devicetype } = req.body;

    if (!(devicename && deviceuser && ip && mac && devicetype)) {
        res.status(400);
        next(new Error('Fill in all fields'));
        return;
    }

    if (!regex.username.test(deviceuser)) {
        res.status(400);
        next(new Error('Incorrect deviceuser format'));
        return;
    }

    if (!regex.ip.test(ip)) {
        res.status(400);
        next(new Error('Incorrect ip format'));
        return;
    }

    if (!regex.mac.test(mac)) {
        res.status(400);
        next(new Error('Incorrect mac format'));
        return;
    }

    if (!req.user) {
        res.status(401);
        next(new Error('No user given'));
        return;
    }

    const { _id } = (await User.findById(req.user._id)) as SafeUserDocument;

    if (!_id) {
        res.status(401);
        next(new Error('No user id found'));
        return;
    }

    const device = await Device.create({
        userid: _id,
        devicename: devicename,
        deviceuser: deviceuser,
        ip: ip,
        mac: mac,
        devicetype: devicetype,
    });

    res.status(201).json(device);
};

const updateDevice = async (req: Request, res: Response, next: NextFunction) => {
    const deviceId = req.params.id;
    const { devicename, deviceuser, ip, mac, devicetype } = req.body;

    if (!(devicename && deviceuser && ip && mac && devicetype)) {
        res.status(400);
        next(new Error('Fill in all fields'));
        return;
    }

    if (!regex.username.test(deviceuser)) {
        res.status(400);
        next(new Error('Incorrect deviceuser format'));
        return;
    }

    if (!regex.ip.test(ip)) {
        res.status(400);
        next(new Error('Incorrect ip format'));
        return;
    }

    if (!regex.mac.test(mac)) {
        res.status(400);
        next(new Error('Incorrect mac format'));
        return;
    }

    if (!req.user) {
        res.status(401);
        next(new Error('No user given'));
        return;
    }

    const user = (await User.findById(req.user._id)) as SafeUserDocument;
    const userid = user._id;

    if (!userid) {
        res.status(401);
        next(new Error('No user id found'));
        return;
    }

    const device = await Device.findById(deviceId);

    if (!device) {
        res.status(400);
        next(new Error('Device not found'));
        return;
    }

    if (device.userid.toString() !== userid.toString()) {
        res.status(401);
        next(new Error('Not authorized'));
        return;
    }

    const updatedDevice = await Device.findByIdAndUpdate(
        deviceId,
        {
            devicename,
            deviceuser,
            ip,
            mac,
            devicetype,
        },
        { new: true },
    );

    res.status(200).json(updatedDevice);
};

const removeDevice = async (req: Request, res: Response, next: NextFunction) => {
    const deviceId = req.params.id;

    if (!req.user) {
        res.status(401);
        next(new Error('No user given'));
        return;
    }

    const user = (await User.findById(req.user._id)) as SafeUserDocument;
    const userid = user._id;

    if (!userid) {
        res.status(401);
        next(new Error('No user id found'));
        return;
    }

    const device = await Device.findById(deviceId);

    if (!device) {
        res.status(400);
        next(new Error('Device not found'));
        return;
    }

    if (device.userid.toString() !== userid.toString()) {
        res.status(401);
        next(new Error('Not authorized'));
        return;
    }

    await Device.findByIdAndDelete(deviceId);

    res.status(200).json({ id: deviceId });
};

export { getDevices, getDeviceById, createDevice, updateDevice, removeDevice };
