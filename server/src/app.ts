import express, { Application } from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import cors from 'cors';
import router from './routes/routes';
import cookieParser from 'cookie-parser';

const app: Application = express();

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);
app.use(cookieParser())

const allowedOrigins = [
    "http://localhost:5173",
    "http://wol.pcstet.cloud",
    "https://wol.pstet.pro",
    "http://197.168.2.197:3500"
]

type CorsOptions = {
    credentials: boolean;
    origin: (origin: string | undefined, callback: (error: Error | null, success: boolean) => void) => void;
};

const corsOptions: CorsOptions = {
    credentials: true,
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error("Origin not allowed"), false)
        }
        return callback(null, true)
    },
}

app.use(cors(corsOptions));

app.use(router);

app.listen(process.env.PORT, (): void => {
    console.log('Running on port', process.env.PORT);
});
