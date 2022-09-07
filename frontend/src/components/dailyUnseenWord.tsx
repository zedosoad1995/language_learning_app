import Button from '@mui/material/Button'
import { useEffect, useState } from "react"
import httpRequest from '../services/httpRequest'
import WordCard from './wordCard'


function DailyUnseenWord({ words, updateWords, callSnackbar }: { words: Array<any>, updateWords: any, callSnackbar: any }) {
	const [word, setWord]: [any, any] = useState()

	const getUnseenWord = () => {
		const unseenWord = words.find((word: any) => !word.is_seen)
		if (!unseenWord) {
			setWord()
			return
		}

		setWord(unseenWord)
	}

	const nextWord = () => {
		if (word && 'id' in word) {
			const data = {
				knowledge: word.knowledge,
				relevance: word.relevance,
				is_seen: true,
				is_learned: word.is_learned
			}

			if (word.knowledge < 1 || word.knowledge > 5) return callSnackbar('Field "knowledge" must be between 1 and 5 starts', true)
			if (word.relevance < 1 || word.relevance > 5) return callSnackbar('Field "relevance" must be between 1 and 5 starts', true)

			httpRequest('PATCH', `words/${word.id}/`, data)
				.then(() => {
					updateWords()
				})
		}
	}

	useEffect(() => {
		getUnseenWord()
		updateWords()
	}, [JSON.stringify(words)])

	const changeWord = (newWord: any) => {
		setWord(newWord)
	}

	return (
		<WordCard word={word} cardActions={<Button onClick={nextWord} >Next Word</Button>} changeWord={changeWord} />
	);
}

export default DailyUnseenWord;
