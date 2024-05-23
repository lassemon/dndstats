Installation to cPanel:

- upload latest code to server /dmtools/ (do not copy node_modules or build folder)

  - remove:
    /nodevenv/dmtools/18/lib/packages
  - upload:
    to /nodevenv/dmtools/18/lib
    -- packages/\*
    -- tsconfig.package.json
    -- tsconfig.build.json
    -- package-lock.json

  - remove: -- don't remove package-lock.json from /dmtools root folder (you can overwrite it yes)
    /dmtools/packages
  - upload:
    to /dmtools/packages
    -- local machine: run `npm run clean:build`. LOCALLY on root before you upload to remove lib folders
    -- packages/\*
    -- tsconfig.package.json
    -- tsconfig.build.json
    -- package-lock.json
    -- package.json

  - remove:
    /nodevenv/dmtools/18/lib/backend/
    -- /src
    -- /tools
  - upload:
    to /nodevenv/dmtools/18/lib/backend/
    -- /src
    -- /tools
    -- tsoa.json
    -- tsconfig.json
    -- swagger.json
    -- package.json
    -- nodemon.json

  - remove:
    /dmtools/backend/src
    /dmtools/backend/tools
    /dmtools/backend/build

  - upload:
    to /dmtools/backend
    -- backend/src
    -- backend/tools
    -- backend/<files (not folders)> <-- except README.MD and .env

- open cPanel and go to Setup Node.js App
- edit the application
- check that cPanel Environment variables matches projects .env file defined variables
- copy the "source ..." command from the view
- open a new terminal and open source
  -- BEOYND HERE, THERE BE DRAGONS --
  - stop the application from the cPanel UI
  - run rm -rf node_modules in /home/viitevhg/dmtools/
  - press the "Run NPM Install" -button
    //- run `tail -f logs/dmtools.log`
- in the terminal goto ../nodevenv/dmtools/18/lib and run `npm run build`
- then goto /home/viitevhg/dmtools/backend and run `npm run build`
- finally
  - if you stopped the app, start it from the web UI
  - press the "Run Script" -button and run the build script
  - Restart the app

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

TIPS

- app needs to run at port 80
- app cannot be started manually from terminal, but only through the web application UI
- npm i does not work outside of /nodevenv/dmtools/18/lib, put e.g. backend there and run npm i and copy node_modules from there if needed
- putting changes only to /home/viitevhg/dmtools/backend or /home/viitevhg/dmtools/packages does not change anything. must put them under /nodevenv/dmtools/18/lib and `npm run build`
