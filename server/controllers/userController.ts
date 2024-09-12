import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import bcrypt, { genSalt } from 'bcrypt';

import { User } from './../schema/schema';
import { SafeUserDocument } from '../../types/custom';

async function generateJwt(userid: string, hash: string, expSeconds: number): Promise<string> {
    const tokenSecret = process.env.TOKEN_SECRET;

    if (tokenSecret) {
        return sign({ userid: userid, hash: hash }, tokenSecret, { expiresIn: `${expSeconds} s` });
    } else {
        throw new Error('No TOKEN_SECRET variable set');
    }
}

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400);
        next(new Error('Please fill in all fields'));
    }

    const userExists = await User.findOne({ username });

    if (userExists) {
        res.status(400);
        next(new Error('User already exists'));
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
        username,
        password: passwordHash,
    });

    if (user) {
        const jwtExpSeconds = 86400;
        const jwtToken = await generateJwt(user._id.toString(), user.password, jwtExpSeconds);

        res.status(201).json({
            _id: user.id,
            username: user.username,
            token: jwtToken,
            exp: jwtExpSeconds,
        });
    } else {
        res.status(400);
        next(new Error('Invalid user data.'));
    }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400);
        next(new Error('Please fill in all fields'));
        return;
    }

    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
        const jwtExpSeconds = 86400;
        const jwtToken = await generateJwt(user._id.toString(), user.password, jwtExpSeconds);

        res.status(200).json({
            _id: user.id,
            username: user.username,
            token: jwtToken,
            exp: jwtExpSeconds,
        });
    } else {
        res.status(401);
        next(new Error('Invalid credentials'));
    }
};

const getMe = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        res.status(400);
        next(new Error('No user object included'));
        return;
    }
    const { _id, username } = (await User.findById(req.user._id)) as SafeUserDocument;

    res.status(200).json({
        id: _id,
        username: username,
    });
};

export { loginUser, registerUser, getMe };
