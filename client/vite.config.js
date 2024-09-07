"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// https://vitejs.dev/config/
exports.default = (0, vite_1.defineConfig)({
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3500',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    },
    plugins: [(0, plugin_react_1.default)()],
    resolve: {
        alias: [{ find: '@', replacement: path_1.default.resolve(__dirname, 'src') }],
    },
    define: {
        'process.env': process.env
    }
});
