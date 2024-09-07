"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const material_1 = require("@mui/material");
const react_hook_form_1 = require("react-hook-form");
const theme_1 = require("@/theme");
const FormInputDropdown = ({ name, control, label, options, }) => {
    const theme = (0, material_1.useTheme)();
    const colors = (0, theme_1.tokens)(theme.palette.mode);
    const generateSingleOptions = () => {
        return options.map((option) => {
            return (<material_1.MenuItem key={option.value} value={option.value}>
          {option.label}
        </material_1.MenuItem>);
        });
    };
    return (<material_1.FormControl fullWidth sx={{ color: colors.gray[500], m: "0.5rem 0" }}>
      <material_1.InputLabel>{label}</material_1.InputLabel>
      <react_hook_form_1.Controller render={({ field: { onChange, value } }) => (<material_1.Select onChange={onChange} value={value} color="secondary" variant="standard">
            {generateSingleOptions()}
          </material_1.Select>)} control={control} name={name}/>
    </material_1.FormControl>);
};
exports.default = FormInputDropdown;
