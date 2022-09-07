import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import httpRequest from '../services/httpRequest'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import NativeSelect from '@mui/material/NativeSelect'


const theme = createTheme();

export default function SignUp({ callSnackbar }: any) {
  const navigate = useNavigate()
  const [numDailyWords, setNumDailyWords]: [any, any] = useState(3)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const payload = {
      username: data.get('username'),
      password: data.get('password'),
      email: data.get('email'),
      first_name: data.get('firstName'),
      last_name: data.get('lastName'),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      num_daily_words: numDailyWords
    }

    if (payload.username === '') return callSnackbar("Field 'username' is required", true)
    if (payload.password === '') return callSnackbar("Field 'password' is required", true)
    if (payload.email === '') return callSnackbar("Field 'email' is required", true)
    if (payload.first_name === '') return callSnackbar("Field 'first name' is required", true)
    if (payload.last_name === '') return callSnackbar("Field 'last name' is required", true)

    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')

    httpRequest('POST', 'users/', payload)
      .then(() => {
        navigate('/login')
      })
      .catch((err) => {
        if (typeof err === 'string') {
          callSnackbar(err, true)
        } else {
          try {
            const firstError = (Object.values(err.response.data)[0] as Array<string>)[0]
            callSnackbar(firstError, true)
          } catch {
            callSnackbar('Registration Error', true)
          }
        }
      })
  };

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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel variant="standard" htmlFor="daily-words">
                    Daily Words
                  </InputLabel>
                  <NativeSelect
                    defaultValue={3}
                    inputProps={{
                      name: 'dailyWords',
                      id: 'daily-words',
                    }}
                    value={numDailyWords}
                    onChange={(e) => { setNumDailyWords(e.target.value) }}
                  >
                    <option value={1}>1</option>
                    <option value={3}>3</option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </NativeSelect>
                </FormControl>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}