import { useEffect, useState } from "react"
import _ from 'lodash'
import Button from '@mui/material/Button'
import httpRequest from '../services/httpRequest'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import WordCard from './wordCard'


function WordDetail({ callSnackbar }: any) {
	const [word, setWord]: [any, any] = useState()

	const navigate = useNavigate()

	const { id } = useParams()

	const onEdit = () => {
		const data = {
			knowledge: word.knowledge,
			relevance: word.relevance,
			is_learned: word.is_learned
		}

		if (word.knowledge < 1 || word.knowledge > 5) return callSnackbar('Field "knowledge" must be between 1 and 5 starts', true)
		if (word.relevance < 1 || word.relevance > 5) return callSnackbar('Field "relevance" must be between 1 and 5 starts', true)

		httpRequest('PATCH', `words/${id}/`, data)
			.then(() => navigate(-1))
			.then(() => callSnackbar('Word successfully edited'))
	}

	const onRemove = () => {
		httpRequest('DEL', `words/${id}/`)
			.then(() => navigate(-1))
			.then(() => callSnackbar('Word successfully removed'))
	}

	useEffect(() => {
		httpRequest('GET', `words/${id}/`)
			.then(response => {
				setWord(response.data)
			})
	}, [])

	const changeWord = (newWord: any) => {
		setWord(newWord)
	}

	return (
		<WordCard word={word} cardActions={
			<>
				<Button onClick={onEdit}>Edit</Button>
				<Button onClick={onRemove}>Remove</Button>
			</>
		} changeWord={changeWord} />
	);
}

export default WordDetail;
