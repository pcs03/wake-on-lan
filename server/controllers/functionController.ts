import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import ping from 'ping';
import { wake } from 'wol';
import { exec } from 'child_process';

import { Device, User } from './../schema/schema';
import { SafeUserDocument } from '../../types/custom';

const pingDevice = async (req: Request, res: Response, next: NextFunction) => {
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

    const ip = device.ip;

    const pingResponse = await ping.promise.probe(ip, { timeout: 1, extra: ['-c', '1'] });
    const alive = pingResponse.alive;
    res.status(200).json({ status: alive });
};

const wolDevice = async (req: Request, res: Response, next: NextFunction) => {
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

const shutdownDevice = async (req: Request, res: Response, next: NextFunction) => {
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
