import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'


export default function Header(){
  const navigate = useNavigate()
  const loggedIn = useSelector((state: any) => state.login.loggedIn)

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          { loggedIn ? 
              <>
                <Box sx={{ flexGrow: 1, display: 'flex' }}>
                  <Button color="inherit"  onClick={() => {navigate('/')}}> Home </Button>
                  <Button color="inherit"  onClick={() => {navigate('/word_list')}}> Words </Button>
                  <Button color="inherit"  onClick={() => {navigate('/settings')}}> Settings </Button>
                </Box>
                <Button color="inherit" variant="outlined"  onClick={() => {navigate('/logout')}}>Logout</Button>
              </>
            :
              <Box sx={{marginLeft: 'auto'}}>
                <Button color="inherit" variant="text"  onClick={() => {navigate('/register')}}>Register</Button>
                <Button color="inherit" variant="outlined" onClick={() => {navigate('/login')}} sx={{ml: 2}}>Login</Button>
              </Box>
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
}
