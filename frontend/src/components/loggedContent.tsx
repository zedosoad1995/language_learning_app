import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddWord from "../components/addWord";
import '../App.css';
import Home from "../components/home";
import SignUp from "../components/signUp";
import Header from "../components/header";
import WordsList from "../components/wordsList";
import WordDetail from "../components/wordDetail";
import { useEffect, useState } from "react"
import { logIn } from '../slices/login'
import { useDispatch, useSelector } from 'react-redux'
import Settings from "./settings";
import httpRequest from "../services/httpRequest";


function LoggedContent({ callSnackbar }: any) {
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

    if (!accessToken || !refreshToken) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login/';
    } else {
      dispatch(logIn())
    }

    getUser()
  }, [JSON.stringify(user)])

  return (
    <>
      <Routes>
        <Route path="/" element={<Home callSnackbar={callSnackbar} />} />
        <Route path="/add_word" element={<AddWord callSnackbar={callSnackbar} />} />
        <Route path="/word_list" element={<WordsList callSnackbar={callSnackbar} />} />
        <Route path="/word/:id" element={<WordDetail callSnackbar={callSnackbar} />} />
        <Route path="/settings" element={<Settings user={user} updateUser={getUser} />} />
      </Routes>
    </>
  );
}

export default LoggedContent;
