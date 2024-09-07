"use strict";
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
const react_1 = require("react");
const DeviceProvider_1 = require("../../context/DeviceProvider");
const react_hook_form_1 = require("react-hook-form");
const material_1 = require("@mui/material");
const FormInputText_1 = __importDefault(require("@/components/FormInputText"));
const FormInputDropdown_1 = __importDefault(require("@/components/FormInputDropdown"));
const theme_1 = require("@/theme");
const yup_1 = require("@hookform/resolvers/yup");
const yup_2 = require("yup");
const FlexBetween_1 = __importDefault(require("@/components/FlexBetween"));
const defaultValues = {
    devicetype: '',
    devicename: '',
    username: '',
    ip: '',
    mac: '',
};
const dropdownOptions = [
    {
        label: 'Computer',
        value: '1',
    },
    {
        label: 'Server',
        value: '2',
    },
    {
        label: 'Singleboard',
        value: '3',
    },
];
const DeviceInput = ({ mode, id, formFields }) => {
    const { devices, setDevices } = (0, react_1.useContext)(DeviceProvider_1.DevicesContext);
    const theme = (0, material_1.useTheme)();
    const colors = (0, theme_1.tokens)(theme.palette.mode);
    const usernamePattern = /^[a-z_]([a-z0-9_-]{0,31}|[a-z0-9_-]{0,30}\$)$/;
    const ipPattern = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
    const macPattern = /^([0-9A-Fa-f]{12}|([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2})$/;
    const userSchema = (0, yup_2.object)({
        devicetype: (0, yup_2.string)().required('Required'),
        devicename: (0, yup_2.string)().required('Required').max(15, 'Too long'),
        deviceuser: (0, yup_2.string)().required('Required').matches(usernamePattern, 'Not a valid username'),
        mac: (0, yup_2.string)().required('Required').matches(macPattern, 'Not a valid MAC Address').uppercase(),
        ip: (0, yup_2.string)().required('Required').matches(ipPattern, 'Not a valid IP Address'),
    });
    const { handleSubmit, control, reset } = (0, react_hook_form_1.useForm)({
        resolver: (0, yup_1.yupResolver)(userSchema),
        defaultValues: mode == 'update' ? formFields : defaultValues,
    });
    function addDevice(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`http://${process.env.API_HOST}/devices`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const body = yield response.json();
            const newDevices = [...devices, body];
            setDevices(newDevices);
        });
    }
    function updateDevice(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`http://${process.env.API_HOST}/devices/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const body = yield response.json();
            const newDevices = [...devices];
            const deviceIndex = newDevices.findIndex((device) => device._id === id);
            newDevices[deviceIndex] = body;
            setDevices(newDevices);
        });
    }
    return (<material_1.Box textAlign="center">
            <form>
                <material_1.Typography variant="h3" color={colors.greenAccent[500]}>
                    {mode == 'add' ? 'Add a New Device' : 'Update Device'}
                </material_1.Typography>

                <FormInputDropdown_1.default name="devicetype" control={control} label="Type" options={dropdownOptions}/>

                <FormInputText_1.default name="devicename" control={control} label="Device Name"/>
                <FormInputText_1.default name="deviceuser" control={control} label="Device User"/>
                <FormInputText_1.default name="ip" control={control} label="IP Address"/>
                <FormInputText_1.default name="mac" control={control} label="MAC Address"/>

                <FlexBetween_1.default m="0 5rem">
                    <material_1.Button type="submit" onClick={mode == 'add'
            ? handleSubmit((data) => addDevice(data))
            : handleSubmit((data) => updateDevice(data))} variant="contained" color="secondary" sx={{ m: '0.5rem 0', width: '6rem' }}>
                        {mode === 'add' ? 'Add' : 'Update'}
                    </material_1.Button>
                    <material_1.Button onClick={() => reset()} variant="contained" color="secondary" sx={{ m: '0.5rem 0.5rem', width: '6rem' }} type="submit">
                        Reset
                    </material_1.Button>
                </FlexBetween_1.default>
            </form>
        </material_1.Box>);
};
exports.default = DeviceInput;
