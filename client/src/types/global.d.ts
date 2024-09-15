declare type Device = {
    devicetype: string;
    devicename: string;
    deviceuser: string;
    ip: string;
    mac: string;
    _id: string;
};

declare type DeviceInputFields = {
    devicetype: string;
    devicename: string;
    deviceuser: string;
    ip: string;
    mac: string;
};

declare type UserFormFields = {
    username: string;
    password: string;
};

declare type User = {
    _id: string;
    username: string;
    token?: string;
    exp?: int;
};

declare type option = {
    label: string;
    value: string;
};
