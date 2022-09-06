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
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";


function LoggedContent() {
  const dispatch = useDispatch()
  const [user, setUser] = useState()
  const [open, setOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [isSnackbarError, setIsSnackbarError] = useState(false)

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

  const callSnackbar = (msg: string, isError: boolean = false) => {
    setIsSnackbarError(isError)
    setOpen(true)
    setAlertMessage(msg)
  }

  const handleClose = () => {
    setOpen(false)
    setAlertMessage('')
  }

  return (
    <>
      <Snackbar open={open && alertMessage !== ''} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={(isSnackbarError) ? "error" : "success"} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add_word" element={<AddWord callSnackbar={callSnackbar} />} />
        <Route path="/word_list" element={<WordsList callSnackbar={callSnackbar} />} />
        <Route path="/word/:id" element={<WordDetail callSnackbar={callSnackbar} />} />
        <Route path="/settings" element={<Settings user={user} updateUser={getUser} />} />
      </Routes>
    </>
  );
}

export default LoggedContent;
