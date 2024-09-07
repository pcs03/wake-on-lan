"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const DeviceProvider_1 = require("@/context/DeviceProvider");
const DeviceList_1 = __importDefault(require("../DeviceList/DeviceList"));
const react_auth_kit_1 = require("react-auth-kit");
const Home = () => {
    const [devices, setDevices] = (0, react_1.useState)([]);
    const value = { devices, setDevices };
    const auth = (0, react_auth_kit_1.useAuthUser)();
    console.log(auth);
    (0, react_1.useEffect)(() => {
        fetch(`http://${process.env.API_HOST}/devices`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'applications/json',
            },
        })
            .then((res) => res.json())
            .then((data) => {
            setDevices(data);
        });
    }, []);
    return (<DeviceProvider_1.DevicesContext.Provider value={value}>
            <DeviceList_1.default />
        </DeviceProvider_1.DevicesContext.Provider>);
};
exports.default = Home;
