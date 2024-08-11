import { isProduction } from '../general/helpers';

export const keys = !isProduction()
	? {
		apiKey: 'AIzaSyD-117AZU4nEdFo1Z2XRvVZO-_Dj8QQCf4',
		authDomain: 'delib-v3-dev.firebaseapp.com',
		databaseURL: 'https://delib-v3-dev.firebaseio.com',
		projectId: 'delib-v3-dev',
		storageBucket: 'delib-v3-dev.appspot.com',
		messagingSenderId: '78129543863',
		appId: '1:78129543863:web:1e4884c2e1f88b0810eb32',
		measurementId: 'G-TFEFHKEX4D',
	}
	: {
		apiKey: 'AIzaSyBEumZUTCL3Jc9pt7_CjiSVTxmz9aMqSvo',
		authDomain: 'synthesistalyaron.firebaseapp.com',
		databaseURL: 'https://synthesistalyaron.firebaseio.com',
		projectId: 'synthesistalyaron',
		storageBucket: 'synthesistalyaron.appspot.com',
		messagingSenderId: '799655218679',
		appId: '1:799655218679:web:1409dd5e3b4154ecb9b2f2',
		measurementId: 'G-XSGFFBXM9X',
	};

export const vapidKey = !isProduction()
	? 'BH5HoVPWsJy58r_Qyr8uikZB3qgQq7LKG3vqqzYGcBvwnO_VHC3_F9n4vMJIytHjshn0UGIvKFVVSftrdYGhPhM'
	: 'BDPJqTToQGWTXonXbOHfh7EMC4VtkTU69jzFCAv3yo-jDs3BtDxC1tVSjxRrAabetOl7WNuc5YnyS26iYQOMdSQ';
