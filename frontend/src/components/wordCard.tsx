import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Rating from '@mui/material/Rating'
import CardActions from '@mui/material/CardActions'
import Divider from '@mui/material/Divider'


function WordCard({word, cardActions, changeWord}: any) {
	return (
    <>
			{word &&
				<Card key={word.id}>
					<CardContent>
						<Typography variant="h5">
							{word['original_word']}
						</Typography>
						<Typography color="text.secondary">
							{word['translated_word']}
						</Typography>
						<Divider sx={{my: 2}}/>
						<Typography>
							Knowledge
						</Typography>
						<Rating
							value={word.knowledge}
							onChange={(_, newValue: any) => {
								changeWord({...word, knowledge: newValue})
							}}
						/>
						<Typography>
							Relevance
						</Typography>
						<Rating
							value={word.relevance}
							onChange={(_, newValue: any) => {
								changeWord({...word, relevance: newValue})
							}}
						/>
						<FormControlLabel 
							sx={{display: 'block'}}
							control={
								<Checkbox onChange={() => {changeWord({...word, is_learned: !word.is_learned})}} checked={word.is_learned} />
							} 
							label='I already know this word' 
						/>
					</CardContent>
					<CardActions>
						{cardActions}
					</CardActions>
				</Card>}
    </>
  );
}

export default WordCard;
