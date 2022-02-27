import React from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import {
	Elements,
	CardElement,
	ElementsConsumer,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Review from './Review';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const PaymentForm = ({
	checkoutToken,
	shippingData,
	onCaptureCheckout,
	prevStep,
	nextStep,
}) => {
	const handleSubmit = async (event, elements, stripe) => {
		event.preventDefault();
		if (!elements || !stripe) return;
		const cardElement = elements.getElement(CardElement);
		const { error, paymentMethod } = await stripe.createPaymentMethod({
			type: 'card',
			card: cardElement,
		});
		if (error) {
			console.log(error);
		} else {
			const orderData = {
				line_items: checkoutToken.live.line_items,
				customer: {
					firstname: shippingData.firstName,
					lastname: shippingData.lastName,
					email: shippingData.email,
				},
				shipping: {
					name: 'Primary',
					street: shippingData.address,
					town_city: shippingData.city,
					county_state: shippingData.subdivision,
					postal_zip_code: shippingData.postalCode,
					country: shippingData.country,
				},
				fulfillment: { shipping_method: shippingData.shippingOption },
				payment: {
					gateway: 'stripe',
					stripe: {
						payment_method_id: paymentMethod.id,
					},
				},
			};
			onCaptureCheckout(checkoutToken.id, orderData);
			console.log(orderData);
			nextStep();
		}
	};
	return (
		<>
			<Review checkoutToken={checkoutToken} />
			<Divider />
			<Typography variant='h6' gutterBottom style={{ margin: '20px 0' }}>
				Payment Method
			</Typography>

			<Elements stripe={stripePromise}>
				<ElementsConsumer>
					{({ elements, stripe }) => (
						<form
							onSubmit={(e) => {
								handleSubmit(e, elements, stripe);
							}}
						>
							<CardElement />

							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									padding: '20px 0',
								}}
							>
								<Button variant='outlined' onClick={prevStep}>
									Back
								</Button>
								<Button
									variant='contained'
									type='submit'
									disabled={!stripe}
									color='primary'
								>
									Pay {checkoutToken.live.subtotal.formatted_with_symbol}
								</Button>
							</div>
						</form>
					)}
				</ElementsConsumer>
			</Elements>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					padding: '10px 0',
				}}
			>
				<Typography variant='subtitles2' style={{ paddingBottom: '30px' }}>
					*Use demo card: 4242 4242 4242 4242, 04/24, CVV: 242, ZIP: 42424
					<br />
					(just keep pressing 4-2-4-2-...)
				</Typography>
			</div>
		</>
	);
};

export default PaymentForm;
