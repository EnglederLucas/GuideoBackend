export default {
	port: parseInt(process.env.PORT ?? '3030'),
	dbUrl: process.env.DB_URL,
	dbName: process.env.DB_NAME ?? 'guideo',
	credPath: process.env.CRED_PATH ?? '/vyzerdb-736d7-firebase-adminsdk-vqpte-d08dfa582b.json',
	publicPath: process.env.PUBLIC_PATH ?? '/public',
	loggingPath: process.env.LOGGING_PATH ?? '/public/logs'
};
