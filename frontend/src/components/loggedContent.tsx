import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddWord from "../components/addWord";
import '../App.css';
import Home from "../components/home";
import SignUp from "../components/signUp";
import Header from "../components/header";
import WordsList from "../components/wordsList";
import WordDetail from "../components/wordDetail";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box'
import { useEffect, useState } from "react"
import { logIn } from '../slices/login'
import { useDispatch, useSelector } from 'react-redux'
import Settings from "./settings";
import httpRequest from "../services/httpRequest";


function LoggedContent() {
  const dispatch = useDispatch()
  const [user, setUser] = useState()

  const getUser = () => {
    httpRequest('GET', `users/me/`)
      .then((res) => {
        setUser(res.data)
      })
  }

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token')
    const refreshToken = localStorage.getItem('refresh_token')

    if(!accessToken || !refreshToken){
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login/';
    }else{
      dispatch(logIn())
    }

    getUser()
  }, [JSON.stringify(user)])

  return (
    <Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/add_word" element={<AddWord/>} />
    <Route path="/word_list" element={<WordsList />} />
    <Route path="/word/:id" element={<WordDetail />} />
    <Route path="/settings" element={<Settings user={user} />} />
    </Routes>
  );
}

export default LoggedContent;
