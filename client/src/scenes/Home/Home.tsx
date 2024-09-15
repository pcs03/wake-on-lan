import { useEffect, useState } from 'react';
import { DevicesContext } from '@/context/DeviceProvider';
import DeviceList from '../DeviceList/DeviceList';

const Home: React.FC = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const value = { devices, setDevices };

    useEffect(() => {
        fetch(`http://${process.env.API_HOST}/devices`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'applications/json',
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setDevices(data);
            });
    }, []);

    return (
        <DevicesContext.Provider value={value}>
            <DeviceList />
        </DevicesContext.Provider>
    );
};

export default Home;
