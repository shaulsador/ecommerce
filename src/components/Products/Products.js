import React from 'react';
import { Grid } from '@material-ui/core';
import Product from './Product/Product';
import makeStyles from './styles';

function Products({ display, handleAdd }) {
	const classes = makeStyles();
	return (
		<main className={classes.content}>
			<div className={classes.toolbar}></div>
			<Grid container justify='center' spacing={4}>
				{display.map((item) => (
					<Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
						<Product product={item} functionAdd={handleAdd}></Product>
					</Grid>
				))}
			</Grid>
		</main>
	);
}

export default Products;

// const List = [
// 	{
// 		id: 1,
// 		name: 'shoes',
// 		discription: 'running shoes',
// 		price: '$5',
// 		image: '',
// 	},
// 	{
// 		id: 2,
// 		name: 'clothes',
// 		discription: 'nike shirt',
// 		price: '$10',
// 		image: '',
// 	},
// ];
