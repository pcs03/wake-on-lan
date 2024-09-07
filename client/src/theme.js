"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMode = exports.ColorModeContext = exports.themeSettings = exports.tokens = void 0;
const react_1 = require("react");
const styles_1 = require("@mui/material/styles");
// Color Design Tokens
const tokens = (mode) => (Object.assign({}, (mode === "dark"
    ? {
        gray: {
            100: "#e0e0e0",
            200: "#c2c2c2",
            300: "#a3a3a3",
            400: "#858585",
            500: "#666666",
            600: "#525252",
            700: "#3d3d3d",
            800: "#292929",
            900: "#141414",
        },
        primary: {
            100: "#d0d1d5",
            200: "#a1a4ab",
            300: "#727681",
            400: "#1f2a40",
            500: "#141b2d",
            600: "#101624",
            700: "#0c101b",
            800: "#080b12",
            900: "#040509",
        },
        greenAccent: {
            100: "#dbf5ee",
            200: "#b7ebde",
            300: "#94e2cd",
            400: "#70d8bd",
            500: "#4cceac",
            600: "#3da58a",
            700: "#2e7c67",
            800: "#1e5245",
            900: "#0f2922",
        },
        redAccent: {
            100: "#f8dcdb",
            200: "#f1b9b7",
            300: "#e99592",
            400: "#e2726e",
            500: "#db4f4a",
            600: "#af3f3b",
            700: "#832f2c",
            800: "#58201e",
            900: "#2c100f",
        },
        blueAccent: {
            100: "#e1dffe",
            200: "#c3bffd",
            300: "#a4a0fc",
            400: "#8680fb",
            500: "#6860fa",
            600: "#534dc8",
            700: "#3e3a96",
            800: "#2a2664",
            900: "#151332",
        },
    }
    : {
        gray: {
            100: "#141414",
            200: "#292929",
            300: "#3d3d3d",
            400: "#525252",
            500: "#666666",
            600: "#858585",
            700: "#a3a3a3",
            800: "#c2c2c2",
            900: "#e0e0e0",
        },
        primary: {
            100: "#040509",
            200: "#080b12",
            300: "#0c101b",
            400: "#f2f0f0",
            500: "#141b2d",
            600: "#434957",
            700: "#727681",
            800: "#a1a4ab",
            900: "#d0d1d5",
        },
        greenAccent: {
            100: "#0f2922",
            200: "#1e5245",
            300: "#2e7c67",
            400: "#3da58a",
            500: "#4cceac",
            600: "#70d8bd",
            700: "#94e2cd",
            800: "#b7ebde",
            900: "#dbf5ee",
        },
        redAccent: {
            100: "#2c100f",
            200: "#58201e",
            300: "#832f2c",
            400: "#af3f3b",
            500: "#db4f4a",
            600: "#e2726e",
            700: "#e99592",
            800: "#f1b9b7",
            900: "#f8dcdb",
        },
        blueAccent: {
            100: "#151332",
            200: "#2a2664",
            300: "#3e3a96",
            400: "#534dc8",
            500: "#6860fa",
            600: "#8680fb",
            700: "#a4a0fc",
            800: "#c3bffd",
            900: "#e1dffe",
        },
    })));
exports.tokens = tokens;
// MUI Theme settings
const themeSettings = (mode) => {
    const colors = (0, exports.tokens)(mode);
    return {
        palette: Object.assign({ mode: mode }, (mode === "dark"
            ? {
                primary: {
                    main: colors.primary[500],
                },
                secondary: {
                    main: colors.greenAccent[500],
                },
                neutral: {
                    dark: colors.gray[700],
                    main: colors.gray[500],
                    light: colors.gray[100],
                },
                background: {
                    default: colors.primary[500],
                },
            }
            : {
                primary: {
                    main: colors.primary[100],
                },
                secondary: {
                    main: colors.greenAccent[500],
                },
                neutral: {
                    dark: colors.gray[700],
                    main: colors.gray[500],
                    light: colors.gray[100],
                },
                background: {
                    default: "#fcfcfc",
                },
            })),
        typography: {
            fontFamily: ["Open Sans", "sans serif"].join(","),
            fontSize: 12,
            h1: {
                fontFamily: ["Open Sans", "sans serif"].join(","),
                fontSize: 40,
            },
            h2: {
                fontFamily: ["Open Sans", "sans serif"].join(","),
                fontSize: 32,
            },
            h3: {
                fontFamily: ["Open Sans", "sans serif"].join(","),
                fontSize: 24,
            },
            h4: {
                fontFamily: ["Open Sans", "sans serif"].join(","),
                fontSize: 20,
            },
            h5: {
                fontFamily: ["Open Sans", "sans serif"].join(","),
                fontSize: 16,
            },
            h6: {
                fontFamily: ["Open Sans", "sans serif"].join(","),
                fontSize: 14,
            },
        },
    };
};
exports.themeSettings = themeSettings;
// Context for color mode
exports.ColorModeContext = (0, react_1.createContext)({
    toggleColorMode: () => { },
});
const useMode = () => {
    const [mode, setMode] = (0, react_1.useState)("dark");
    const colorMode = (0, react_1.useMemo)(() => ({
        toggleColorMode: () => setMode((prev) => (prev === "light" ? "dark" : "light")),
    }), []);
    const theme = (0, react_1.useMemo)(() => (0, styles_1.createTheme)((0, exports.themeSettings)(mode)), [mode]);
    return [theme, colorMode];
};
exports.useMode = useMode;
