import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import ping from 'ping';
import { wake } from 'wol';
import { exec } from 'child_process';

import { User } from './../schema/schema';

const pingDevice = async (req: Request, res: Response) => {
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

const wolDevice = async (req: Request, res: Response) => {
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
            console.error(error);
            res.status(400).json({ status: error });
        } else {
            console.log(results);
            res.status(200).json({ status: results });
        }
    });
};

const shutdownDevice = async (req: Request, res: Response) => {
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

export { wolDevice, pingDevice, shutdownDevice };
