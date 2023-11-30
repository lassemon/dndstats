Installation to cPanel:
app needs to run at port 80
app cannot be started manually from terminal, but through the web application UI

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
