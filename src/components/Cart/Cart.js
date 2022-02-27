import React from 'react';
import { Container, Grid, Button, Typography } from '@material-ui/core';
import makestyles from './styles';
import CartItem from './CartItem/CartItem';
import { Link } from 'react-router-dom';

const Cart = ({ cart, handleUpdate, handleRemove, handleEmpty }) => {
	const classes = makestyles();
	const EmptyCart = () => (
		<Typography variant='subtitle1'>
			Your cart is empty.{' '}
			<Link to='/' className={classes.link}>
				Start adding something to your cart!
			</Link>
		</Typography>
	);
	const LoadedCart = () => (
		<>
			<Grid container spacing={3}>
				{cart.line_items.map((item) => (
					<Grid item xs={12} sm={4} key={item.id}>
						<CartItem
							item={item}
							functionUpdate={handleUpdate}
							functionRemove={handleRemove}
						/>
					</Grid>
				))}
			</Grid>

			<div className={classes.cartDetails}>
				<Typography variant='h4'>
					Subtotal: {cart.subtotal.formatted_with_code}
				</Typography>
				<div>
					<Button
						className={classes.emptyButton}
						size='large'
						type='button'
						variant='contained'
						color='secondary'
						onClick={handleEmpty}
					>
						Empty Cart
					</Button>
					<Button
						className={classes.checkoutButton}
						size='large'
						type='button'
						variant='contained'
						color='primary'
						component={Link}
						to='/checkout'
					>
						Checkout
					</Button>
				</div>
			</div>
		</>
	);
	if (!cart.line_items)
		return (
			<div>
				<div className={classes.toolbar}></div>
				Loading...
			</div>
		);
	return (
		<Container>
			<div className={classes.toolbar}></div>
			<Typography className={classes.title} variant='h3' gutterBottom>
				Your Cart
			</Typography>
			{!cart.total_items ? <EmptyCart /> : <LoadedCart />}
		</Container>
	);
};

export default Cart;
