import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
//import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import httpRequest from '../services/httpRequest';
import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router-dom';


const theme = createTheme();

export default function NewPassword() {
    const navigate = useNavigate()

    const { uid, token } = useParams()
    console.log(uid, token)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const data = new FormData(e.currentTarget)
        if (data.get('password') === data.get('repeatPassword')) {
            httpRequest('POST', `/set-password/${uid}/${token}/`, { password: data.get('password') })
                .then(() => {
                    navigate('login')
                })
        } else {
            console.log('Passwords do not match')
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Reset Password
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            label="Password"
                            name="password"
                            type="password"
                            autoComplete="password"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="repeatPassword"
                            label="Repeat Password"
                            name="repeatPassword"
                            type="password"
                            autoComplete="repeatPassword"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Set New Password
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href='/login' variant="body2">
                                    {"Remember your old password?"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}