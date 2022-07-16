import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import NativeSelect from '@mui/material/NativeSelect'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { useEffect, useState } from "react"
import httpRequest from '../services/httpRequest'

export default function Settings({user}: any){
	const [numDailyWords, setNumDailyWords]: [any, any] = useState()

	useEffect(() => {
		if(user && 'num_daily_words' in user){
			setNumDailyWords(user.num_daily_words)
		}
	}, [JSON.stringify(user)])

	const onEdit = () => {
		const data = {
			num_daily_words: numDailyWords
		}

		httpRequest('PATCH', `users/me/`, data)
	}

	return (
		<Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
			<Grid container spacing={2}>
        <Grid item xs={12}>
					{numDailyWords &&
						<FormControl sx={{ minWidth: 120 }}>
							<InputLabel variant="standard" htmlFor="daily-words">
							Daily Words
							</InputLabel>
							<NativeSelect
							inputProps={{
									name: 'dailyWords',
									id: 'daily-words',
							}}
							value={numDailyWords}
							onChange={(e) => {setNumDailyWords(e.target.value)}}
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
					}
				</Grid>
				<Grid item xs={12}>
					<Button  variant="contained" onClick={onEdit}>Edit</Button>
				</Grid>
			</Grid>
		</Paper>
	)
}