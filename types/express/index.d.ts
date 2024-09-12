declare namespace Express {
    export interface Request {
        user?: import("./../custom").SafeUserDocument;
    }
}
