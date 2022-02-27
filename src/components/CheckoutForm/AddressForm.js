import React, { useState, useEffect } from 'react';
import {
	InputLabel,
	Select,
	MenuItem,
	Button,
	Grid,
	Typography,
} from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import FormInput from './FormInput';
import { commerce } from '../../lib/commerce';
import { Link } from 'react-router-dom';

const AddressForm = ({ checkoutToken, getData }) => {
	const methods = useForm();
	const [countries, setCountries] = useState([]);
	const [country, setCountry] = useState('');
	const [subdivisions, setSubdivisions] = useState([]);
	const [subdivision, setSubdivision] = useState('');
	const [shippingOptions, setShippingOptions] = useState([]);
	const [shippingOption, setShippingOption] = useState('');
	const fetchCountries = async (checkoutTokenId) => {
		const { countries } = await commerce.services.localeListShippingCountries(
			checkoutTokenId
		);
		setCountries(
			Object.entries(countries).map(([code, name]) => ({
				code: code,
				name: name,
			}))
		);
		setCountry(Object.keys(countries)[0]);
	};
	const fetchSubdivions = async (shippingCountry) => {
		const { subdivisions } = await commerce.services.localeListSubdivisions(
			shippingCountry
		);
		setSubdivisions(
			Object.entries(subdivisions).map(([code, name]) => ({
				code: code,
				name: name,
			}))
		);
		setSubdivision(Object.keys(subdivisions)[0]);
	};
	const fetchOptions = async (checkoutTokenId, country, subdivision = null) => {
		const options = await commerce.checkout.getShippingOptions(
			checkoutTokenId,
			{ country, subdivision }
		);
		setShippingOptions(
			options.map((op) => ({
				code: op.id,
				name: `${op.description} - ${op.price.formatted}`,
			}))
		);
		setShippingOption(options[0].id);
	};
	useEffect(() => {
		fetchCountries(checkoutToken.id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		if (country) {
			fetchSubdivions(country);
		}
	}, [country]);
	useEffect(() => {
		if (subdivision) {
			fetchOptions(checkoutToken.id, country, subdivision);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [subdivision]);
	return (
		<>
			<Typography variant='h6' gutterBottom>
				Shipping Address
			</Typography>
			<FormProvider {...methods}>
				<form
					onSubmit={methods.handleSubmit((data) =>
						getData({ ...data, country, subdivision, shippingOption })
					)}
				>
					<Grid container spacing={3}>
						<FormInput name='firstName' label='First Name' />
						<FormInput name='lastName' label='Last Name' />
						<FormInput name='email' label='email' />
						<FormInput name='address' label='Address' />
						<FormInput name='city' label='City' />
						<FormInput name='postalCode' label='Postal Code' />
						<Grid item xs={12} sm={6}>
							<InputLabel>Shipping Country</InputLabel>
							<Select
								value={country}
								fullWidth
								onChange={(e) => setCountry(e.target.value)}
							>
								{countries.map((country) => (
									<MenuItem key={country.code} value={country.code}>
										{country.name}
									</MenuItem>
								))}
							</Select>
						</Grid>
						<Grid item xs={12} sm={6}>
							<InputLabel>Shipping Subdivision</InputLabel>
							<Select
								value={subdivision}
								fullWidth
								onChange={(e) => setSubdivision(e.target.value)}
							>
								{subdivisions.map((subdivision) => (
									<MenuItem key={subdivision.code} value={subdivision.code}>
										{subdivision.name}
									</MenuItem>
								))}
							</Select>
						</Grid>
						<Grid item xs={12} sm={6}>
							<InputLabel>Shipping Options</InputLabel>
							<Select
								value={shippingOption}
								fullWidth
								onChange={(e) => setShippingOption(e.target.value)}
							>
								{shippingOptions.map((op) => (
									<MenuItem key={op.code} value={op.code}>
										{op.name}
									</MenuItem>
								))}
							</Select>
						</Grid>
					</Grid>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							padding: '50px 0',
						}}
					>
						<Button variant='outlined' component={Link} to='/cart'>
							Back to Cart
						</Button>
						<Button variant='contained' type='submit' color='primary'>
							Next
						</Button>
					</div>
				</form>
			</FormProvider>
		</>
	);
};

export default AddressForm;
