import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { User, Device } from './../schema/schema';

const getDevices = async (req: Request, res: Response, next: NextFunction) => {
    const cookies = req.cookies;

    const jwt = cookies._auth;

    if (!jwt) {
        res.status(400);
        next(new Error('No JWT token provided'));
        return;
    }

    const jwtSecret = process.env.TOKEN_SECRET;

    if (!jwtSecret) {
        console.error('No JWT secret token could be read');
        res.status(400).json({ message: 'No JWT could be read.' });
        return;
    }

    const jwtItems = verify(jwt, jwtSecret);
    const userid = (jwtItems as JwtPayload).userid;
    const user = await User.findById(userid);

    if (!user) {
        console.error('User not found for getDevices method');
        res.status(400);
        return;
    }

    const userDevices = user.devices;
    res.status(200).json(userDevices);
};

const getDeviceById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const cookies = req.cookies;
    const jwt = cookies._auth;
    const jwtSecret = process.env.TOKEN_SECRET;

    if (!jwtSecret) {
        console.error('No JWT secret token could be read');
        res.status(400).json([]);
        return;
    }

    const jwtItems = verify(jwt, jwtSecret);
    const userid = (jwtItems as JwtPayload).userid;
    const user = await User.findById(userid);

    if (!user) {
        console.error('User not found for getDevices method');
        res.status(400);
        return;
    }

    const userDevices = user.devices;
    const device = userDevices.find((device) => device._id?.toString() === id.toString());

    if (!device) {
        console.error(`No device found for id ${id}`);
        res.status(400).json([]);
        return;
    }

    res.status(200).json(device);
};

const createDevice = async (req: Request, res: Response) => {
    const { devicename, deviceuser, ip, mac, devicetype } = req.body;

    const cookies = req.cookies;
    const jwt = cookies._auth;
    const jwtSecret = process.env.TOKEN_SECRET;

    if (!jwtSecret) {
        console.error('No JWT TOKEN found');
        res.status(500);
        return;
    }

    const jwtItems = verify(jwt, jwtSecret);
    const userid = (jwtItems as JwtPayload).userid;
    const user = await User.findById(userid);

    if (!user) {
        console.error('User not found');
        res.status(400);
        return;
    }

    const newDevice = new Device({
        devicename: devicename,
        deviceuser: deviceuser,
        ip: ip,
        mac: mac,
        devicetype: devicetype,
    });

    user.devices.push(newDevice);
    await user.save();
    res.status(201).json(newDevice);
};

const updateDevice = async (req: Request, res: Response) => {
    const deviceId = req.params.id;
    const { devicename, deviceuser, ip, mac, devicetype } = req.body;
    const cookies = req.cookies;
    const jwt = cookies._auth;
    const jwtSecret = process.env.TOKEN_SECRET;

    if (!jwtSecret) {
        console.error('No JWT secret token could be read');
        res.status(400).json([]);
        return;
    }

    const jwtItems = verify(jwt, jwtSecret);
    const userid = (jwtItems as JwtPayload).userid;
    const user = await User.findById(userid);

    if (!user) {
        console.error('User not found for getDevices method');
        res.status(400);
        return;
    }

    const deviceIndex = user.devices.findIndex((device) => device._id?.toString() === deviceId.toString());

    if (deviceIndex === -1) {
        console.error(`No device found for id ${deviceId}`);
        res.status(400);
        return;
    }

    const updatedUser = user.devices[deviceIndex].set({
        devicename: devicename,
        deviceuser: deviceuser,
        devicetype: devicetype,
        ip: ip,
        mac: mac,
    });
    await user.save();

    res.status(200).json(updatedUser);
};

const removeDevice = async (req: Request, res: Response) => {
    const deviceId = req.params.id;
    const cookies = req.cookies;
    const jwt = cookies._auth;
    const jwtSecret = process.env.TOKEN_SECRET;

    if (!jwtSecret) {
        console.error('No JWT secret token could be read');
        res.status(400).json([]);
        return;
    }

    const jwtItems = verify(jwt, jwtSecret);
    const userid = (jwtItems as JwtPayload).userid;
    const user = await User.findById(userid);

    if (!user) {
        console.error('User not found for getDevices method');
        res.status(400);
        return;
    }

    const deviceIndex = user.devices.findIndex((device) => device._id?.toString() === deviceId.toString());

    if (deviceIndex === -1) {
        console.error(`No device found for id ${deviceId}`);
        res.status(400);
        return;
    }

    user.devices.splice(deviceIndex, 1);
    await user.save();

    res.status(200).json({ id: deviceId });
};

export { getDevices, getDeviceById, createDevice, updateDevice, removeDevice };
