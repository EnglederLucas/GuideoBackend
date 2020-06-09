# Guideo Backend

## Getting started

1. Pull this Repository
2. run `npm run tsc` for compiling typescript files
3. run `npm run start` for starting the server

The server is running :D

If you want automatically compiling and restarting use this steps:
1. Pull this Repository
2. run `npm run tscw` in one terminal (tscw -> typescript watch)
3. run `npm run starw` in another terminal (startw -> start watch -> nodemon)

Now, if you make changes and save the file `tscw` will automatically compile the typescript file and `startw` will automatically start the server  

## Using Https

1. Generate key and certificate file:
```bash
openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365
```
2. Get Decrypted Keys

```bash
openssl rsa -in keytmp.pem -out key.pem
```

3. Copy the files in the `public/security folder`

Resources:
* [medium](https://medium.com/@nitinpatel_20236/how-to-create-an-https-server-on-localhost-using-express-366435d61f28)
* [nodejs](https://nodejs.org/en/knowledge/HTTP/servers/how-to-create-a-HTTPS-server/)

## Contribute

Edit the source code in the source folders
