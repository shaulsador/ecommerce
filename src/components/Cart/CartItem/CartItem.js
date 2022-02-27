import React from 'react';
import {
	Typography,
	Button,
	Card,
	CardMedia,
	CardContent,
	CardActions,
} from '@material-ui/core';
import makestyles from './styles';

const CartItem = ({ item, functionUpdate, functionRemove }) => {
	const classes = makestyles();
	return (
		<Card>
			<CardMedia
				image={item.image.url}
				alt={item.name}
				className={classes.media}
			/>
			<CardContent className={classes.CardContent}>
				<Typography variant='h4'>{item.name}</Typography>
				<Typography variant='h5'>
					{item.line_total.formatted_with_symbol}
				</Typography>
				<Typography variant='subtitle2'>
					{item.price.formatted_with_symbol}/ea
				</Typography>
			</CardContent>
			<CardActions className={classes.cartActions}>
				<div className={classes.buttons}>
					<Button
						type='button'
						size='small'
						onClick={() => functionUpdate(item.id, item.quantity + 1)}
					>
						+
					</Button>
					<Typography>{item.quantity}</Typography>
					<Button
						type='button'
						size='small'
						onClick={() => functionUpdate(item.id, item.quantity - 1)}
					>
						-
					</Button>
				</div>
				<Button
					variant='contained'
					type='button'
					color='secondary'
					onClick={() => {
						functionRemove(item.id);
					}}
				>
					Remove
				</Button>
			</CardActions>
		</Card>
	);
};

export default CartItem;
