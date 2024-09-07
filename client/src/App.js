"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const theme_1 = require("./theme");
const material_1 = require("@mui/material");
const react_router_dom_1 = require("react-router-dom");
const Navbar_1 = __importDefault(require("@/scenes/Navbar/Navbar"));
const Home_1 = __importDefault(require("./scenes/Home/Home"));
const react_auth_kit_1 = require("react-auth-kit");
const Login_1 = __importDefault(require("./scenes/Login/Login"));
const react_1 = __importDefault(require("react"));
const App = () => {
    const [theme, colorMode] = (0, theme_1.useMode)();
    return (<theme_1.ColorModeContext.Provider value={colorMode}>
            <material_1.ThemeProvider theme={theme}>
                <material_1.CssBaseline />
                <div className="app">
                    <react_auth_kit_1.AuthProvider authName="_auth" authType="cookie" cookieDomain={window.location.hostname} cookieSecure={false}>
                        <react_router_dom_1.BrowserRouter>
                            <material_1.Box width="100%" height="100%" p="1rem 0.5rem 4rem 0.5rem">
                                <Navbar_1.default />
                                <react_router_dom_1.Routes>
                                    <react_router_dom_1.Route path="/" element={<react_auth_kit_1.RequireAuth loginPath="/login">
                                                <Home_1.default />
                                            </react_auth_kit_1.RequireAuth>}/>
                                    <react_router_dom_1.Route path="/login" element={<Login_1.default />}/>
                                </react_router_dom_1.Routes>
                            </material_1.Box>
                        </react_router_dom_1.BrowserRouter>
                    </react_auth_kit_1.AuthProvider>
                </div>
            </material_1.ThemeProvider>
        </theme_1.ColorModeContext.Provider>);
};
exports.default = App;
