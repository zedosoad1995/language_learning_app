import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useState } from "react"
import httpRequest from '../services/httpRequest';
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Rating from '@mui/material/Rating'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


function AddWord({ callSnackbar }: any) {
  const navigate = useNavigate()
  const [original, setOriginal] = useState()
  const [translated, setTranslated] = useState()
  const [knowledge, setKnowledge] = useState(1)
  const [relevance, setRelevance] = useState(1)

  function onSubmit(e: any) {
    e.preventDefault()

    const date = new Date();
    const offset_minutes = -date.getTimezoneOffset()

    const score: any = knowledge + 6 - relevance

    const payload = {
      original_word: original,
      translated_word: translated,
      knowledge: knowledge,
      relevance: relevance,
      score: score,
      created_at_local: moment(date).add(offset_minutes, 'm').format("YYYY-MM-DDTHH:mm:ss.sssZZ")
    }

    httpRequest('POST', `words/`, payload)
    navigate('/')
    callSnackbar('Word successfully created')
  }

  return (
    <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
      <Typography variant="h5" align="center" sx={{ mb: 4, fontWeight: 700 }}>
        New Word
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField required fullWidth label='Original Word' id="original-word" value={original} onChange={(e: any) => { setOriginal(e.target.value) }} />
        </Grid>
        <Grid item xs={12}>
          <TextField required fullWidth label='Translated Word' id="translated-word" value={translated} onChange={(e: any) => { setTranslated(e.target.value) }} />
        </Grid>
        <Grid item xs={12}>
          <FormControl variant="standard">
            <Typography>
              Knowledge
            </Typography>
            <Rating
              value={knowledge}
              onChange={(_, newValue: any) => {
                setKnowledge(newValue)
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl variant="standard">
            <Typography>
              Relevance
            </Typography>
            <Rating
              value={relevance}
              onChange={(_, newValue: any) => {
                setRelevance(newValue)
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" sx={{ mt: 3, ml: 1 }} onClick={(e) => { onSubmit(e) }}>Submit</Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default AddWord;