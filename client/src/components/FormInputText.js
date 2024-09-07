"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_hook_form_1 = require("react-hook-form");
const TextField_1 = __importDefault(require("@mui/material/TextField"));
const FormInputText = ({ name, control, label, password }) => {
    return (<react_hook_form_1.Controller name={name} control={control} render={({ field: { onChange, value }, fieldState: { error } }) => (<TextField_1.default helperText={error ? error.message : null} size="small" error={!!error} onChange={onChange} value={value} fullWidth label={label} variant="outlined" color="secondary" sx={{ m: "0.5rem 0" }} type={password ? "password" : "text"}/>)}/>);
};
exports.default = FormInputText;
