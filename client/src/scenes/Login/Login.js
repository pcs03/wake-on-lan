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
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_auth_kit_1 = require("react-auth-kit");
const react_router_dom_1 = require("react-router-dom");
const material_1 = require("@mui/material");
const theme_1 = require("@/theme");
const FormInputText_1 = __importDefault(require("@/components/FormInputText"));
const defaultValues = {
    username: "",
    password: "",
};
const Login = () => {
    const theme = (0, material_1.useTheme)();
    const colors = (0, theme_1.tokens)(theme.palette.mode);
    const signIn = (0, react_auth_kit_1.useSignIn)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { handleSubmit, control, setError } = (0, react_hook_form_1.useForm)({
        defaultValues: defaultValues,
    });
    function login(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(payload);
            const response = yield fetch(`http://${process.env.API_HOST}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            const body = yield response.json();
            const success = body["success"];
            const token = body["token"];
            const expIn = body["exp"];
            if (success) {
                signIn({
                    token: token,
                    expiresIn: expIn / 60,
                    tokenType: "Bearer",
                    authState: { username: payload.username },
                });
                navigate("/");
            }
            else {
                console.log("Error login in");
                setError("username", { type: "custom", message: "Incorrect" });
                setError("password", { type: "custom", message: "Incorrect" });
            }
        });
    }
    return (<material_1.Box maxWidth="500px" margin="auto">
      <form>
        <material_1.Typography variant="h3" color={colors.greenAccent[500]} m="0.5rem 0">
          Login
        </material_1.Typography>

        <FormInputText_1.default name="username" control={control} label="Username"/>
        <FormInputText_1.default name="password" control={control} label="Password" password={true}/>

        <material_1.Button onClick={handleSubmit((data) => login(data))} variant="contained" color="secondary" sx={{ m: "0.5rem 0" }} type="submit">
          Login
        </material_1.Button>
      </form>
    </material_1.Box>);
};
exports.default = Login;
