Installation to cPanel:

- upload latest code to server /dmtools/ (do not copy node_modules or build folder)
- open cPanel and go to Setup Node.js App
- edit the application
- copy the "source ..." command from the view
- open a new terminal and open source
- run rm -rf node_modules
- run `tail -f logs/dmtools.log`
- on the application edit view

  - press the "Run NPM Install" -button
  - press the "Run Script" -button and run the build script
  - Restart the app

  app needs to run at port 80
  app cannot be started manually from terminal, but only through the web application UI

Settings:

- Node.js version 18
- App mode development
- Application root: dmtools
- Application URL: dm.viitekehys.net/ api
- Application startup file build/server.js
- Passenger log file: [/home/viitevhg/]dmtools/logs/dmtools.log

cacert is needed, go to terminal app root and run

```
curl --remote-name --time-cond cacert.pem https://curl.se/ca/cacert.pem
```

then add environment variable from cpanel node app UI
name: SSL_CERT_FILE
value: ./cacert.pem
