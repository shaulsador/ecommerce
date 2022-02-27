import React, { useState, useEffect } from 'react';
// import ReactDOM from 'react-dom';
import { commerce } from './lib/commerce';
import { Products, Navbar, Cart, Checkout } from './components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
	const [list, setList] = useState([]);
	const [cart, setCart] = useState({});
	const [order, setOrder] = useState({});
	const [errorMsg, setErrorMsg] = useState('');

	const fetchProducts = async () => {
		const { data } = await commerce.products.list();
		// console.log(data);
		setList(data);
	};

	const fetchCart = async () => {
		setCart(await commerce.cart.retrieve());
	};

	const addToCart = async (productId, quantity) => {
		const { cart } = await commerce.cart.add(productId, quantity);
		setCart(cart);
	};

	const updateItem = async (productId, quantity) => {
		const { cart } = await commerce.cart.update(productId, { quantity });
		setCart(cart);
	};

	const removeItem = async (productId) => {
		const { cart } = await commerce.cart.remove(productId);
		setCart(cart);
	};

	const emptyCart = async () => {
		const { cart } = await commerce.cart.empty();
		setCart(cart);
	};

	const refreshCart = async () => {
		const newCart = await commerce.cart.refresh();
		setCart(newCart);
	};

	const captureOrder = async (checkoutTokenId, orderData) => {
		try {
			const newOrder = await commerce.checkout.capture(
				checkoutTokenId,
				orderData
			);
			setOrder(newOrder);
			refreshCart();
		} catch (error) {
			setErrorMsg(error.data.error.message);
			console.log(errorMsg);
		}
	};

	useEffect(() => {
		fetchProducts();
		fetchCart();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// console.log(cart);

	return (
		<Router>
			<div>
				<Navbar totalItems={cart.total_items} />
				<Switch>
					<Route path='/' exact>
						<Products display={list} handleAdd={addToCart} />
					</Route>

					<Route path='/cart'>
						<Cart
							cart={cart}
							handleUpdate={updateItem}
							handleRemove={removeItem}
							handleEmpty={emptyCart}
						></Cart>
					</Route>
					<Route path='/checkout'>
						<Checkout
							cart={cart}
							onCaptureCheckout={captureOrder}
							order={order}
							errorMsg={errorMsg}
						></Checkout>
					</Route>
				</Switch>
			</div>
		</Router>
	);
}

export default App;
