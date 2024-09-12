import React, { useContext, useEffect, useState } from 'react';
import StorageIcon from '@mui/icons-material/Storage';
import ComputerIcon from '@mui/icons-material/Computer';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import DeleteIcon from '@mui/icons-material/Delete';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Box, CircularProgress, IconButton, Typography, useTheme } from '@mui/material';
import { DevicesContext } from '../../context/DeviceProvider';
import SensorsIcon from '@mui/icons-material/Sensors';
import UpdateIcon from '@mui/icons-material/Update';
import FlexBetween from '@/components/FlexBetween';
import { tokens } from '@/theme';

interface DeviceProps {
    device: Device;
    onUpdate: (id: string, formFields: DeviceInputFields) => void;
}

function formatMac(mac: string) {
    if (!/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(mac)) {
        return mac.match(/.{1,2}/g)?.join(':');
    } else {
        return mac;
    }
}

const Device: React.FC<DeviceProps> = ({ device, onUpdate }) => {
    const { devices, setDevices } = useContext(DevicesContext);
    const [deviceStatus, setDeviceStatus] = useState<boolean>();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        pingDevice();
    });

    async function sendWol() {
        const response = await fetch(`http://${process.env.API_HOST}/wol/${device._id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status != 400) {
            setLoading(true);
            let counter = 0;
            const intervalId = window.setInterval(async () => {
                const status = await pingDevice();

                if (status || counter >= 30) {
                    setLoading(false);
                    clearInterval(intervalId);
                }

                counter++;
            }, 2000);
        }
    }

    async function sendShutdown() {
        const confirm = window.confirm('Are you sure you want to shutdown this device?');
        if (confirm) {
            const response = await fetch(`http://${process.env.API_HOST}/shutdown/${device._id}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status != 400) {
                console.log('turning off');
                setLoading(true);

                let counter = 0;
                const intervalId = window.setInterval(async () => {
                    const status = await pingDevice();

                    if (!status || counter >= 60) {
                        setLoading(false);
                        clearInterval(intervalId);
                    }

                    counter++;
                }, 2000);
            }
        }
    }

    async function rmDevice() {
        console.log(device);
        const confirm = window.confirm('Are you sure you want to delete this device?');
        if (confirm) {
            const response = await fetch(`http://${process.env.API_HOST}/devices/${device._id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const body = await response.json();
            const deviceId = body._id;

            const deviceIndex = devices.findIndex((device) => {
                return device._id === deviceId;
            });

            const newDevices = [...devices];
            newDevices.splice(deviceIndex, 1);
            setDevices(newDevices);
        }
    }

    async function pingDevice() {
        const response = await fetch(`http://${process.env.API_HOST}/ping/${device._id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const body = await response.json();
        setDeviceStatus(body['status']);

        return body['status'];
    }

    return (
        <FlexBetween border={`2px solid ${colors.gray[800]}`} borderRadius="0.5rem" m="0.5rem 0" p="0px 5px">
            {device.devicetype == '3' ? (
                <DeveloperBoardIcon sx={{ fontSize: '30px' }} />
            ) : device.devicetype == '2' ? (
                <StorageIcon sx={{ fontSize: '30px' }} />
            ) : (
                <ComputerIcon sx={{ fontSize: '30px' }} />
            )}
            {device && (
                <Box>
                    <Typography variant="h4" fontWeight="bold" color={colors.greenAccent[500]} sx={{ m: '0.2rem 0' }}>
                        {device.devicename}
                    </Typography>
                    <Typography variant="h5" sx={{ m: '0.1rem 0' }}>
                        {device.deviceuser + '@' + device.ip}
                    </Typography>
                    <Typography variant="h5" sx={{ m: '0.1rem 0' }}>
                        {formatMac(device.mac)}
                    </Typography>
                </Box>
            )}
            <IconButton onClick={deviceStatus ? sendShutdown : sendWol} disabled={loading}>
                {loading ? (
                    <CircularProgress variant="indeterminate" color="secondary" sx={{ fontSize: 50 }} />
                ) : (
                    <PowerSettingsNewIcon sx={{ fontSize: 50 }} color={deviceStatus ? 'success' : 'error'} />
                )}
            </IconButton>

            <Box display="flex" flexDirection="column">
                <IconButton onClick={rmDevice}>
                    <DeleteIcon />
                </IconButton>
                <IconButton
                    onClick={() =>
                        onUpdate(device._id, {
                            devicetype: device.devicetype,
                            deviceuser: device.deviceuser,
                            devicename: device.devicename,
                            ip: device.ip,
                            mac: device.mac,
                        })
                    }
                >
                    <UpdateIcon />
                </IconButton>
                <IconButton onClick={pingDevice}>
                    <SensorsIcon />
                </IconButton>
            </Box>
        </FlexBetween>
    );
};

export default Device;
