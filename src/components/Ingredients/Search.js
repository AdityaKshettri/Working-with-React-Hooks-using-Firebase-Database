import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import useHttp from '../../hooks/http';
import ErrorModal from '../UI/ErrorModal';
import './Search.css';

const Search = React.memo(props => {
	const {onLoadIngredients} = props;
	const [enteredFilter, setEnteredFilter] = useState('');
	const inputRef = useRef();
	const {isLoading, data, error, sendRequest, clear} = useHttp();

	useEffect(() => {
		const timer = setTimeout(() => {
			if(enteredFilter === inputRef.current.value) {
				const query = 
					enteredFilter.length === 0 
					? '' 
					: `?orderBy="title"&equalTo="${enteredFilter}"`;
				sendRequest(
					'https://react-hooks-demo-project.firebaseio.com/ingredients.json' + query,
					'GET',
				);
			}
			
		}, 500);
		return () => {
			clearTimeout(timer);
		};
	}, [enteredFilter, inputRef, sendRequest]);

	useEffect(() => {
		if(!isLoading && !error && data) {
			const loaderIngredients = [];
			for(const key in data) {
				loaderIngredients.push({
					id: key,
					title: data[key].title,
					amount: data[key].amount
				});
			}
			onLoadIngredients(loaderIngredients);
		}
	}, [data, isLoading, error, onLoadIngredients]);

    return (
		<section className="search">
			{error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
			<Card>
				<div className="search-input">
					<label>Filter by Title</label>
					{isLoading && <span>Loading...</span>}
					<input 
						ref={inputRef}
						type="text"
						value={enteredFilter}
						onChange={event => setEnteredFilter(event.target.value)} />
				</div>
			</Card>
		</section>
    );
});

export default Search;
