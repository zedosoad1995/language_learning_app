import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import DailyUnseenWord from "./dailyUnseenWord"
import WordsOfTheDay from "./wordsOfTheDay"
import httpRequest from "../services/httpRequest"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"


function Home() {
  const navigate = useNavigate();
  const [words, setWords] = useState([])
  const [isDailyWordsSeen, setIsDailyWordsSeen] = useState(true)

  const updateData = () => {
    const data = {
      'timezone': Intl.DateTimeFormat().resolvedOptions().timeZone
    }

    return httpRequest('POST', `words/update/`, data)
  }

  const fetchData = () => {
    httpRequest('GET', `words/daily/`)
      .then(response => {
        setWords(response.data)
        return response.data
      })
      .then((response: Array<any>) => {
        setIsDailyWordsSeen(response.every(word => word.is_seen))
      })
  }

  useEffect(() => {
    updateWords()
  }, [])

  const updateWords = () => {
    updateData()
      .then(fetchData)
  }

  const fabStyle = {
    position: 'fixed',
    bottom: 16,
    right: 16,
  }

  return (
    <>
      <Fab color="primary" aria-label="add" sx={fabStyle} onClick={() => navigate("/add_word")}>
        <AddIcon />
      </Fab>
      {isDailyWordsSeen ?
        <WordsOfTheDay words={words} updateWords={updateWords} />
        : <DailyUnseenWord words={words} updateWords={updateWords} />}
    </>
  );
}

export default Home;
