import 'dotenv/config';
import { Request, Response } from 'express';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import ping from 'ping';
import { wake } from 'wol';
import { exec } from 'child_process';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { User, Device } from './../schema/schema';

const { MONGO_PORT, MONGO_HOST, MONGO_DBNAME } = process.env;

const MONGO_URI = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DBNAME}`;

const mongooseConnect = async () => {
    console.log(`connnecting to ${MONGO_URI}`)
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to Mongo DB');
    } catch (error) {
        console.error(error);
    }
};
mongooseConnect();

async function generateJwt(userid: string, hash: string, expSeconds: number) {
    const tokenSecret = process.env.TOKEN_SECRET;

    if (tokenSecret) {
        return sign({ userid: userid, hash: hash }, tokenSecret, { expiresIn: `${expSeconds} s` });
    } else {
        throw new Error('No TOKEN_SECRET variable set');
    }
}

export const getDevices = async (req: Request, res: Response) => {
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
    res.status(200).json(userDevices);
};

export const getDeviceById = async (req: Request, res: Response) => {
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

export const createDevice = async (req: Request, res: Response) => {
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

export const updateDevice = async (req: Request, res: Response) => {
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
    await user.save()

    res.status(200).json(updatedUser);
};

export const removeDevice = async (req: Request, res: Response) => {
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

export const registerUser = async (req: Request, res: Response) => {
    const { username, password, adminpassword } = req.body;

    const adminPasswordHash = process.env.ADMIN_PW;

    if (!adminPasswordHash) {
        console.error('Could not read ADMIN_PW env variable');
        res.status(500);
        return;
    }

    if (!adminpassword) {
        console.error("No admin password provided")
        res.status(403).json({status: "No admin password provided"})
        return
    }

    const adminPasswordMatch = await bcrypt.compare(adminpassword, adminPasswordHash);

    if (!adminPasswordMatch) {
        console.error('Incorrect admin password');
        res.status(403).json({ status: 'Incorrect admin password' });
        return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    try {
        const user = await User.create({
            username: username,
            password: passwordHash,
            devices: [],
        });

        console.log(user);
        res.status(200).json({ status: user });
    } catch (error) {
        res.status(400).json({ status: error });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
        console.error(`No user found for username "${username}"`);
        res.status(401).json({ success: false });
        return;
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
        const jwtExpSeconds = 86400;
        const jwtToken = await generateJwt(user._id.toString(), user.password, jwtExpSeconds);
        res.status(200).json({ success: true, token: jwtToken, exp: jwtExpSeconds });
    } else {
        res.status(401).json({ success: false });
    }
};

export const pingDevice = async (req: Request, res: Response) => {
    const id = req.params.id;
    const cookies = req.cookies;
    const jwt = cookies._auth;
    const jwtSecret = process.env.TOKEN_SECRET;

    if (!jwtSecret) {
        console.error('No JWT secret token could be read');
        res.status(500);
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
        res.status(400);
        return;
    }

    const ip = device.ip;

    const pingResponse = await ping.promise.probe(ip, { timeout: 1, extra: ['-c', '1'] });
    const alive = pingResponse.alive;
    res.status(200).json({ status: alive });
};

export const wolDevice = async (req: Request, res: Response) => {
    const id = req.params.id;
    const cookies = req.cookies;
    const jwt = cookies._auth;
    const jwtSecret = process.env.TOKEN_SECRET;

    if (!jwtSecret) {
        console.error('No JWT secret token could be read');
        res.status(400);
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
        res.status(400).json({ status: 'No device found for given id' });
        return;
    }

    wake(device.mac, (error, results) => {
        if (error) {
            console.error(error)
            res.status(400).json({ status: error });
        } else {
            console.log(results)
            res.status(200).json({ status: results });
        }
    });
};

export const shutdownDevice = async (req: Request, res: Response) => {
    const id = req.params.id;
    const cookies = req.cookies;
    const jwt = cookies._auth;
    const jwtSecret = process.env.TOKEN_SECRET;

    if (!jwtSecret) {
        console.error('No JWT secret token could be read');
        res.status(500);
        return;
    }

    const jwtItems = verify(jwt, jwtSecret);
    const userid = (jwtItems as JwtPayload).userid;
    const user = await User.findById(userid);

    if (!user) {
        console.error('User not found for getDevices method');
        res.status(400).json({ status: 'No user found' });
        return;
    }

    const userDevices = user.devices;
    const device = userDevices.find((device) => device._id?.toString() === id.toString());

    if (!device) {
        console.error(`No device found for id ${id}`);
        res.status(400).json({ status: 'No devices found for id' });
        return;
    }

    const deviceuser = device.deviceuser;
    const ip = device.ip;

    exec(`ssh ${deviceuser}@${ip} sudo shutdown -h now`, (error, results) => {
        console.log(error);
        console.log(results);
        if (error) {
            if (error.code == 255) {
                res.status(200).json({ status: error }); // This error is expected behavior when executing a shutdown from SSH
            } else {
                res.status(400).json({ status: error });
            }
        } else {
            res.status(200).json({ status: results });
        }
    });
};
