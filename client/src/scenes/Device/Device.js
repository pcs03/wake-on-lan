"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const Storage_1 = __importDefault(require("@mui/icons-material/Storage"));
const Computer_1 = __importDefault(require("@mui/icons-material/Computer"));
const DeveloperBoard_1 = __importDefault(require("@mui/icons-material/DeveloperBoard"));
const Delete_1 = __importDefault(require("@mui/icons-material/Delete"));
const PowerSettingsNew_1 = __importDefault(require("@mui/icons-material/PowerSettingsNew"));
const material_1 = require("@mui/material");
const DeviceProvider_1 = require("../../context/DeviceProvider");
const Sensors_1 = __importDefault(require("@mui/icons-material/Sensors"));
const Update_1 = __importDefault(require("@mui/icons-material/Update"));
const FlexBetween_1 = __importDefault(require("@/components/FlexBetween"));
const theme_1 = require("@/theme");
function formatMac(mac) {
    var _a;
    if (!/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(mac)) {
        return (_a = mac.match(/.{1,2}/g)) === null || _a === void 0 ? void 0 : _a.join(':');
    }
    else {
        return mac;
    }
}
const Device = ({ device, onUpdate }) => {
    const { devices, setDevices } = (0, react_1.useContext)(DeviceProvider_1.DevicesContext);
    const [deviceStatus, setDeviceStatus] = (0, react_1.useState)();
    const theme = (0, material_1.useTheme)();
    const colors = (0, theme_1.tokens)(theme.palette.mode);
    const [loading, setLoading] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        pingDevice();
    });
    function sendWol() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`http://${process.env.API_HOST}/wol/${device._id}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status != 400) {
                setLoading(true);
                let counter = 0;
                const intervalId = window.setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    const status = yield pingDevice();
                    if (status || counter >= 30) {
                        setLoading(false);
                        clearInterval(intervalId);
                    }
                    counter++;
                }), 2000);
            }
        });
    }
    function sendShutdown() {
        return __awaiter(this, void 0, void 0, function* () {
            const confirm = window.confirm('Are you sure you want to shutdown this device?');
            if (confirm) {
                const response = yield fetch(`http://${process.env.API_HOST}/shutdown/${device._id}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.status != 400) {
                    console.log('turning off');
                    setLoading(true);
                    let counter = 0;
                    const intervalId = window.setInterval(() => __awaiter(this, void 0, void 0, function* () {
                        const status = yield pingDevice();
                        if (!status || counter >= 60) {
                            setLoading(false);
                            clearInterval(intervalId);
                        }
                        counter++;
                    }), 2000);
                }
            }
        });
    }
    function rmDevice() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(device);
            const confirm = window.confirm('Are you sure you want to delete this device?');
            if (confirm) {
                const response = yield fetch(`http://${process.env.API_HOST}/devices/${device._id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const body = yield response.json();
                const deviceId = body._id;
                const deviceIndex = devices.findIndex((device) => {
                    return device._id === deviceId;
                });
                const newDevices = [...devices];
                newDevices.splice(deviceIndex, 1);
                setDevices(newDevices);
            }
        });
    }
    function pingDevice() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`http://${process.env.API_HOST}/ping/${device._id}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const body = yield response.json();
            setDeviceStatus(body['status']);
            return body['status'];
        });
    }
    return (<FlexBetween_1.default border={`2px solid ${colors.gray[800]}`} borderRadius="0.5rem" m="0.5rem 0" p="0px 5px">
            {device.devicetype == '3' ? (<DeveloperBoard_1.default sx={{ fontSize: '30px' }}/>) : device.devicetype == '2' ? (<Storage_1.default sx={{ fontSize: '30px' }}/>) : (<Computer_1.default sx={{ fontSize: '30px' }}/>)}
            {device && (<material_1.Box>
                    <material_1.Typography variant="h4" fontWeight="bold" color={colors.greenAccent[500]} sx={{ m: '0.2rem 0' }}>
                        {device.devicename}
                    </material_1.Typography>
                    <material_1.Typography variant="h5" sx={{ m: '0.1rem 0' }}>
                        {device.deviceuser + '@' + device.ip}
                    </material_1.Typography>
                    <material_1.Typography variant="h5" sx={{ m: '0.1rem 0' }}>
                        {formatMac(device.mac)}
                    </material_1.Typography>
                </material_1.Box>)}
            <material_1.IconButton onClick={deviceStatus ? sendShutdown : sendWol} disabled={loading}>
                {loading ? (<material_1.CircularProgress variant="indeterminate" color="secondary" sx={{ fontSize: 50 }}/>) : (<PowerSettingsNew_1.default sx={{ fontSize: 50 }} color={deviceStatus ? 'success' : 'error'}/>)}
            </material_1.IconButton>

            <material_1.Box display="flex" flexDirection="column">
                <material_1.IconButton onClick={rmDevice}>
                    <Delete_1.default />
                </material_1.IconButton>
                <material_1.IconButton onClick={() => onUpdate(device._id, {
            devicetype: device.devicetype,
            deviceuser: device.deviceuser,
            devicename: device.devicename,
            ip: device.ip,
            mac: device.mac,
        })}>
                    <Update_1.default />
                </material_1.IconButton>
                <material_1.IconButton onClick={pingDevice}>
                    <Sensors_1.default />
                </material_1.IconButton>
            </material_1.Box>
        </FlexBetween_1.default>);
};
exports.default = Device;
