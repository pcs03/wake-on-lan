"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const material_1 = require("@mui/material");
const FlexBetween_1 = __importDefault(require("@/components/FlexBetween"));
const Lan_1 = __importDefault(require("@mui/icons-material/Lan"));
const theme_1 = require("../../theme");
const DarkModeOutlined_1 = __importDefault(require("@mui/icons-material/DarkModeOutlined"));
const LightModeOutlined_1 = __importDefault(require("@mui/icons-material/LightModeOutlined"));
const Navbar = () => {
    const theme = (0, material_1.useTheme)();
    const colors = (0, theme_1.tokens)(theme.palette.mode);
    const colorMode = (0, react_1.useContext)(theme_1.ColorModeContext);
    const [selected, setSelected] = (0, react_1.useState)("home");
    return (<FlexBetween_1.default mb="0.25rem" p="0.5rem 0rem" color={colors.primary[100]}>
      {/* LEFT SIDE */}
      <FlexBetween_1.default gap="0.75rem">
        <Lan_1.default sx={{ fontSize: "28px" }}/>
        <material_1.Typography variant="h4" fontSize="16px">
          Wake On LAN
        </material_1.Typography>
      </FlexBetween_1.default>

      {/* RIGHT SIDE */}
      <FlexBetween_1.default gap="2rem">
        <material_1.Box sx={{ "&:hover": { color: colors.blueAccent[500] } }}>
          <react_router_dom_1.Link to="/" onClick={() => setSelected("home")} style={{
            color: selected === "home" ? "inherit" : colors.primary[500],
            textDecoration: "inherit",
        }}>
            Home
          </react_router_dom_1.Link>
        </material_1.Box>
        <material_1.IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (<DarkModeOutlined_1.default />) : (<LightModeOutlined_1.default />)}
        </material_1.IconButton>
      </FlexBetween_1.default>
    </FlexBetween_1.default>);
};
exports.default = Navbar;
