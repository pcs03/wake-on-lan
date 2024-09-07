import express, { Application } from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorMiddleware';
import { connectDB } from './config/db';
import deviceRouter from './routes/deviceRouter';
import userRouter from './routes/userRouter';
import functionRouter from './routes/functionRouter';

const app: Application = express();

connectDB();

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);
app.use(cookieParser());
app.use(errorHandler);

const allowedOrigins = [
    'http://localhost:5173',
    'http://wol.pcstet.cloud',
    'https://wol.pstet.pro',
    'http://197.168.2.197:3500',
    'http://localhost:3500',
];

type CorsOptions = {
    credentials: boolean;
    origin: (origin: string | undefined, callback: (error: Error | null, success: boolean) => void) => void;
};

const corsOptions: CorsOptions = {
    credentials: true,
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('Origin not allowed'), false);
        }
        return callback(null, true);
    },
};

app.use(cors(corsOptions));

// app.use(router);

app.use('/api/devices', deviceRouter);
app.use('/api/users', userRouter);
app.use("/api/", functionRouter);

app.use(express.static(process.cwd() + './../../client/dist/'));

const port = process.env.PORT || 5000;
app.listen(process.env.PORT, (): void => {
    console.log('Running on port', port);
});
