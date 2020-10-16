export default { 
    port: parseInt(process.env.PORT ?? "3030"),
    dbUrl: process.env.DB_URL,
    dbName: process.env.DB_NAME,
    credPath: process.env.CRED_PATH,
    publicPath: process.env.PUBLIC_PATH
}