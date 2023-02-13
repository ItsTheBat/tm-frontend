import { useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';

export default function Logout() {
    const { logout } = useLogout();
    const navigate = useNavigate();

    logout().then((response) => {
        navigate('/');
    }).catch((err) => {
        console.log('Logout error: ', err);
        navigate('/');
    });
};