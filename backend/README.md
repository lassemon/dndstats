Installation to cPanel:

- upload latest code to server /dmtools/ (do not copy node_modules or build folder)

  - remove:
    -/dmtools/backend/src
    /nodevenv/dmtools/18/lib/packages
  - upload:
    - backend/src
    - backend/tools
    - backend/\*<files> <-- except README.MD
      -> to /dmtools/backend
    - packages/\*
    - run `npm run clean:build` on root before you upload to remove lib folders
      -> to /dmtools/packages
      -> to /nodevenv/dmtools/18/lib

- open cPanel and go to Setup Node.js App
- edit the application
- copy the "source ..." command from the view
- open a new terminal and open source
  //- run rm -rf node_modules
  //- run `tail -f logs/dmtools.log`
  //- on the application edit view
- in the terminal goto /nodevenv/dmtools/18/lib and run `npm run build`
- then goto /home/viitevhg/dmtool and run `npm run build`
- finally goto

  - press the "Run NPM Install" -button
  - press the "Run Script" -button and run the build script
  - Restart the app

  app needs to run at port 80
  app cannot be started manually from terminal, but only through the web application UI

Steps how I got it to work

- FTP copy backend AND packages/\* AND tsconfig.build.json AND tsconfig.package.json under /nodevenv/dmtools/18/lib
- run `npm i `from project root at /home/viitevhg/dmtools
- run `run npm build` in project root
- set access rights to all node modules `chmod -R 777 /home/viitevhg/dmtools/node_modules`
- run `npm run build` under dmtools/backend

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
