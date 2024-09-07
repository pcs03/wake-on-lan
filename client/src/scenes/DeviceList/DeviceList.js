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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const material_1 = require("@mui/material");
const DeviceProvider_1 = require("@/context/DeviceProvider");
const Device_1 = __importDefault(require("../Device/Device"));
const DeviceInput_1 = __importDefault(require("../DeviceInput/DeviceInput"));
const Add_1 = __importDefault(require("@mui/icons-material/Add"));
const HighlightOff_1 = __importDefault(require("@mui/icons-material/HighlightOff"));
const DeviceList = () => {
    const { devices } = (0, react_1.useContext)(DeviceProvider_1.DevicesContext);
    const [popup, setPopup] = (0, react_1.useState)(false);
    const [popupMode, setPopupMode] = (0, react_1.useState)('add');
    const [deviceId, setDeviceId] = (0, react_1.useState)(undefined);
    const [formFields, setFormFields] = (0, react_1.useState)();
    const handleUpdate = (id, formFields) => {
        if (popup) {
            setPopup(false);
        }
        else {
            setPopup(true);
            setPopupMode('update');
            setDeviceId(id);
            setFormFields(formFields);
        }
    };
    const handleAdd = () => {
        if (popup) {
            setPopup(false);
        }
        else {
            setPopupMode('add');
            setPopup(true);
        }
    };
    return (<material_1.Box maxWidth="500px" margin="auto">
            {devices.map((device) => (<Device_1.default device={device} key={device._id} onUpdate={handleUpdate}/>))}
            <material_1.Box display="flex" justifyContent="center" flexDirection="column">
                <material_1.IconButton sx={{
            height: '3rem',
            width: '3rem',
            margin: 'auto',
        }} onClick={handleAdd}>
                    {popup ? <HighlightOff_1.default sx={{ fontSize: '2rem' }}/> : <Add_1.default sx={{ fontSize: '2rem' }}/>}
                </material_1.IconButton>
                {popup && <DeviceInput_1.default mode={popupMode} id={deviceId} formFields={formFields}/>}
            </material_1.Box>
        </material_1.Box>);
};
exports.default = DeviceList;
