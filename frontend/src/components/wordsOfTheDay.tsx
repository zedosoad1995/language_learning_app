import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import { useNavigate } from "react-router-dom";
import { Box } from '@mui/material'
import { useTimer } from 'react-timer-hook'
import { useEffect, useState } from 'react';
import httpRequest from '../services/httpRequest';


function WordsOfTheDay({ words, updateWords }: { words: Array<any>, updateWords: any }) {
  const navigate = useNavigate()

  const [expiryTimestamp, setExpiryTimestamp] = useState(new Date())

  useEffect(() => {
    const time = new Date()
    time.setHours(24, 0, 0, 0)
    setExpiryTimestamp(time)
  }, [])

  useEffect(() => {
    restart(expiryTimestamp, true)
  }, [expiryTimestamp])

  const wordDetails = (e: any) => {
    const id = e.currentTarget.getAttribute('data-index')
    navigate(`/word/${id}`)
  }

  const onTimerExpire = () => {
    updateWords()
      .then(() => {
        const time = new Date()
        time.setHours(24, 0, 0, 0)
        setExpiryTimestamp(time)
      })
  }

  const {
    seconds,
    minutes,
    hours,
    restart,
  } = useTimer({ expiryTimestamp, onExpire: onTimerExpire })

  const formatedTime = `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`

  return (
    <>
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Box sx={{ display: 'inline-block' }}>
          <Typography variant='h4' sx={{ fontWeight: 600, mb: 0 }}>Words of the day</Typography>
          <Typography variant='subtitle2' sx={{ textAlign: 'left', lineHeight: 1 }}>Next set of Words - {formatedTime}</Typography>
        </Box>
      </Box>
      <Stack spacing={2}>
        {words.map((word) =>
          <Card raised sx={{ maxWidth: 500 }} key={word.id} data-index={word.id} onClick={(e) => wordDetails(e)}>
            <CardContent>
              <Typography variant="h5" component="div">
                {word['original_word']}
              </Typography>
              <Typography color="text.secondary">
                {word['translated_word']}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Stack>
    </>
  );
}

export default WordsOfTheDay;
