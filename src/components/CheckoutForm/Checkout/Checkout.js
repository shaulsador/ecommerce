import React, { useState, useEffect } from 'react';
import {
	Paper,
	Stepper,
	Step,
	StepLabel,
	Typography,
	CircularProgress,
	Divider,
	Button,
	CssBaseline,
} from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import makeStyles from './styles';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import { commerce } from '../../../lib/commerce';

const steps = ['Shipping Address', 'Payment Details'];

const Checkout = ({ cart, onCaptureCheckout, order, errorMsg }) => {
	const classes = makeStyles();
	const [activeStep, setActiveStep] = useState(0);
	const [checkoutToken, setCheckoutToken] = useState(null);
	const [shippingData, setShippingData] = useState({});
	const history = useHistory();
	const generateToken = async () => {
		try {
			const token = await commerce.checkout.generateToken(cart.id, {
				type: 'cart',
			});
			setCheckoutToken(token);
		} catch (error) {
			console.log(error);
			if (activeStep !== steps.length) history.push('/');
		}
	};

	function nextStep() {
		setActiveStep((step) => step + 1);
	}
	function prevStep() {
		setActiveStep((step) => step - 1);
	}
	const getShippingData = (data) => {
		setShippingData(data);
		nextStep();
		console.log(data);
	};

	useEffect(() => {
		generateToken();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cart]);
	const Form = () => {
		return activeStep === 0 ? (
			<AddressForm checkoutToken={checkoutToken} getData={getShippingData} />
		) : (
			<PaymentForm
				checkoutToken={checkoutToken}
				shippingData={shippingData}
				onCaptureCheckout={onCaptureCheckout}
				prevStep={prevStep}
				nextStep={nextStep}
			/>
		);
	};
	let Confirmation = () =>
		order.customer ? (
			<>
				<div style={{ marginBottom: '10px' }}>
					<Typography variant='h5'>
						Thank you for shopping at Chez Xiaotian, {order.customer.firstname}{' '}
						{order.customer.lastname}!
					</Typography>
					<Divider className={classes.divider} />
					<Typography variant='subtitle1'>
						Reference id: {order.customer_reference}
					</Typography>
				</div>
				<Button
					component={Link}
					to='/'
					variant='outlined'
					type='button'
					style={{ marginBottom: '20px' }}
				>
					Back to Home
				</Button>
			</>
		) : (
			<div className={classes.spinner}>
				<CircularProgress />
			</div>
		);

	if (errorMsg) {
		Confirmation = () => {
			<>
				<Typography variant='h5' style={{ marginBottom: '20px' }}>
					Error: {errorMsg}
				</Typography>

				<Button component={Link} variant='outlined' type='button' to='/'>
					Back to home
				</Button>
			</>;
		};
	}

	return (
		<>
			<CssBaseline />
			<div className={classes.toolbar}></div>
			<main className={classes.layout}>
				<Paper classes={classes.paper}>
					<Typography variant='h4' align='center'>
						Checkout
					</Typography>
					<Stepper activeStep={activeStep} className={classes.stepper}>
						{steps.map((step) => (
							<Step key={step}>
								<StepLabel>{step}</StepLabel>
							</Step>
						))}
					</Stepper>
					{activeStep === steps.length ? (
						<Confirmation />
					) : (
						checkoutToken && <Form />
					)}
				</Paper>
			</main>
		</>
	);
};

export default Checkout;
