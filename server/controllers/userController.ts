import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { User } from './../schema/schema';

async function generateJwt(userid: string, hash: string, expSeconds: number): Promise<string> {
    const tokenSecret = process.env.TOKEN_SECRET;

    if (tokenSecret) {
        return sign({ userid: userid, hash: hash }, tokenSecret, { expiresIn: `${expSeconds} s` });
    } else {
        throw new Error('No TOKEN_SECRET variable set');
    }
}

const registerUser = async (req: Request, res: Response) => {
    const { username, password, adminpassword } = req.body;

    const adminPasswordHash = process.env.ADMIN_PW;

    if (!adminPasswordHash) {
        console.error('Could not read ADMIN_PW env variable');
        res.status(500);
        return;
    }

    if (!adminpassword) {
        console.error('No admin password provided');
        res.status(403).json({ status: 'No admin password provided' });
        return;
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
        console.log(error);
        res.status(400).json({ status: error });
    }
};

const loginUser = async (req: Request, res: Response) => {
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

export { loginUser, registerUser };
