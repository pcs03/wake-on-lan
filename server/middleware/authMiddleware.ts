import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../schema/schema';
import { SafeUserDocument } from './../../types/custom';

interface TokenPayload extends jwt.JwtPayload {
    userid: string;
    hash: string;
    iat: number;
    exp: number;
}

const protect = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;

    if (!auth) {
        res.status(401);
        next(new Error('No token provided'));
        return;
    }

    if (!auth.startsWith('Bearer')) {
        res.status(401);
        next(new Error('Token is not a valid Bearer token'));
        return;
    }

    let token;
    try {
        token = auth.split(' ')[1];
    } catch (error) {
        res.status(401);
        next(new Error('Invalid token'));
        return;
    }

    try {
        const tokenSecret = process.env.TOKEN_SECRET as jwt.Secret;

        if (!tokenSecret) {
            res.status(500);
            next(new Error('Could not find token secret'));
            return;
        }

        const decodedToken = jwt.verify(token, tokenSecret) as TokenPayload;

        const user: SafeUserDocument = await User.findById(decodedToken.userid).select("-password");
        req.user = user;

        next();
    } catch (error) {
        res.status(401);
        next(new Error('Not authorized'));
    }
};

export { protect };
