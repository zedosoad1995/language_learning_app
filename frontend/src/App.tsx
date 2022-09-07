import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import SignIn from "./components/signIn";
import SignUp from "./components/signUp";
import Logout from "./components/logout";
import Header from "./components/header";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box'
import LoggedContent from "./components/loggedContent";
import ResetPassword from "./components/resetPassword";
import NewPassword from "./components/newPassword";
import { useState } from "react";
import { Alert, Snackbar } from "@mui/material";


function App() {
  const [open, setOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [isSnackbarError, setIsSnackbarError] = useState(false)

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
    <Router>
      <Snackbar open={open && alertMessage !== ''} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={(isSnackbarError) ? "error" : "success"} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <Header />
      <Container maxWidth="sm">
        <Box sx={{ m: 2 }}>
          <Routes>
            <Route path="*" element={<LoggedContent callSnackbar={callSnackbar} />} />
            <Route path="/login" element={<SignIn callSnackbar={callSnackbar} />} />
            <Route path="/register" element={<SignUp callSnackbar={callSnackbar} />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/set-password/:uid/:token" element={<NewPassword />} />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}

export default App;
