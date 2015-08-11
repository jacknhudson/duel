# Rocket

A barebones Node.js app using [Express 4](http://expressjs.com/).

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

```sh
$ git clone https://github.com/jacknhudson/Rocket.git # or clone your own fork
$ cd rocket
$ npm install
$ npm start # or foreman start, or foreman start web
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
$ heroku git:remote -a rqt
$ git push heroku master
$ heroku open
```

## Setting up local database

```
which psql # Checks version/existence of psql
export DATABASE_URL=postgres:///<Username>
psql <Username>
(In psql shell:) 
create table responses (user_id text, question_id integer, response text);
create table users (id text, email text, encrypted_password text);
\q
```

After this, run `foreman start` and you should be good to go!

Note: You may need to download the Postgres software which can be found at the reference link below.

Reference: [https://devcenter.heroku.com/articles/heroku-postgresql#local-setup](https://devcenter.heroku.com/articles/heroku-postgresql#local-setup)

## Adding Questions

Add question to `questions/allQuestions.txt`. Run `python makeQuestions.py`.

## Finding Questions By Index

Run `python question.py <Question_Index>`.

## Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)
