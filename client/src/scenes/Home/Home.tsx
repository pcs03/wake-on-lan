import { useEffect, useState } from 'react';
import { DevicesContext } from '@/context/DeviceProvider';
import DeviceList from '../DeviceList/DeviceList';
import { useAuthUser } from 'react-auth-kit';

const Home: React.FC = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const value = { devices, setDevices };
    const auth = useAuthUser();
    console.log(auth);

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
