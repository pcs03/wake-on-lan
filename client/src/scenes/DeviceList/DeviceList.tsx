import React, { useContext, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { DevicesContext } from '@/context/DeviceProvider';
import Device from '../Device/Device';
import DeviceInput from '../DeviceInput/DeviceInput';
import AddIcon from '@mui/icons-material/Add';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const DeviceList: React.FC = () => {
    const { devices } = useContext(DevicesContext);
    const [popup, setPopup] = useState(false);
    const [popupMode, setPopupMode] = useState<'add' | 'update'>('add');
    const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
    const [formFields, setFormFields] = useState<DeviceInputFields>();

    const handleUpdate = (id: string, formFields: DeviceInputFields) => {
        if (popup) {
            setPopup(false);
        } else {
            setPopup(true);
            setPopupMode('update');
            setDeviceId(id);
            setFormFields(formFields);
        }
    };

    const handleAdd = () => {
        if (popup) {
            setPopup(false);
        } else {
            setPopupMode('add');
            setPopup(true);
        }
    };

    return (
        <Box maxWidth="500px" margin="auto">
            {devices.map((device) => (
                <Device device={device} key={device._id} onUpdate={handleUpdate} />
            ))}
            <Box display="flex" justifyContent="center" flexDirection="column">
                <IconButton
                    sx={{
                        height: '3rem',
                        width: '3rem',
                        margin: 'auto',
                    }}
                    onClick={handleAdd}
                >
                    {popup ? <HighlightOffIcon sx={{ fontSize: '2rem' }} /> : <AddIcon sx={{ fontSize: '2rem' }} />}
                </IconButton>
                {popup && <DeviceInput mode={popupMode} id={deviceId} formFields={formFields} />}
            </Box>
        </Box>
    );
};

export default DeviceList;
