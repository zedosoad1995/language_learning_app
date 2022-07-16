import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { logOut } from '../slices/login'


export default function Logout(){
    const navigate = useNavigate()
	const dispatch = useDispatch()

	useEffect(() => {
		localStorage.removeItem('access_token')
		localStorage.removeItem('refresh_token')
		navigate('/login')
		dispatch(logOut())
	});

    return <></>
}