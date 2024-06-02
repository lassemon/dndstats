# Installing frontend

- run `npm run build` on the root
- run `npm run build` on the frontend
- upload /frontend/build folder to server

# Development

- run `npm install` on the root
- run `npm run build` on the root
- open one shell and go to ./db and run `docker-compose up`
- open another shell to /backend folder and run `npm run watch`
- open a third shell to /frontend folder and run `npm run watch`

# Local testing

- run `docker-compose up` in root folder
- after the docker is up, navigate to:
  - localhost:3000 for the UI
  - localhost/docs for the swagger documentation
- NOTE!! the item table search/filter functionality does not initially work for all the items because
  a 5thESRD item is inserted into the database only when an item is opened from the collapsible view
  in the table. And the search/filter only looks for items from the database, not external sources.
  - if you want to search all the 5thESRD items, go to the Item Table, set the row amount to 200,
    click the "Open all" icon on the top right of the table headers and then browse through all the pages.
    This will query and insert all 5thSRD items to the local database.
- NOTE2!! Initially the database only has one item: The Bag of Holding
