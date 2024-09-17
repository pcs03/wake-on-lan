import { useEffect, useState } from 'react';
import { DevicesContext } from '@/context/DeviceProvider';
import DeviceList from '../DeviceList/DeviceList';
import Protected from '../../components/Protected';
import { useAuth } from '../../hooks/useAuth';

const Home: React.FC = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const value = { devices, setDevices };

    const { user } = useAuth();

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
        <Protected>
            <DevicesContext.Provider value={value}>
                <DeviceList />
            </DevicesContext.Provider>
        </Protected>
    );
};

export default Home;
