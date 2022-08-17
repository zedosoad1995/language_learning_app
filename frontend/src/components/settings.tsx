import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import NativeSelect from '@mui/material/NativeSelect'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { useEffect, useState } from "react"
import httpRequest from '../services/httpRequest'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'


export default function Settings({ user, updateUser }: any) {
	const [numDailyWords, setNumDailyWords]: [any, any] = useState()
	const [open, setOpen] = useState(false)

	useEffect(() => {
		if (user && 'num_daily_words' in user) {
			setNumDailyWords(user.num_daily_words)
		}
	}, [JSON.stringify(user)])

	const onEdit = async () => {
		setOpen(true)

		const data = {
			num_daily_words: numDailyWords
		}

		await httpRequest('PATCH', `users/me/`, data)
		updateUser()
	}

	const handleClose = () => {
		setOpen(false)
	}

	return (
		<Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
			<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
				<Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
					Settings successfully updated
				</Alert>
			</Snackbar>
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
					}
				</Grid>
				<Grid item xs={12}>
					<Button variant="contained" onClick={onEdit}>Edit</Button>
				</Grid>
			</Grid>
		</Paper>
	)
}