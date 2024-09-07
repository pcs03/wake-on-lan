"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesProvider = exports.DevicesContext = exports.DevicesContextDefault = void 0;
const react_1 = require("react");
exports.DevicesContextDefault = {
    devices: [],
    setDevices: () => [],
};
exports.DevicesContext = (0, react_1.createContext)(exports.DevicesContextDefault);
const DevicesProvider = ({ children }) => {
    const [devices, setDevices] = (0, react_1.useState)([]);
    const value = { devices, setDevices };
    return (<>
      <exports.DevicesContext.Provider value={value}>
        {children}
      </exports.DevicesContext.Provider>
    </>);
};
exports.DevicesProvider = DevicesProvider;
