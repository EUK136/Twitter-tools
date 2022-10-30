const http = require("http");
const path = require("path");
const express = require("express");
const socketIo = require("socket.io");
const needle = require("needle");
const dotenv = require("dotenv")
dotenv.config()
const TOKEN = process.env.TWITTER_BEARER_TOKEN;
const PORT = process.env.PORT || 3000;

const app = express()
const server = http.createServer(app)
const io = socketIo(server) 

//Midleware
app.use(express.static('client'));


//Rutas
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'))
})

const rulesURL = "https://api.twitter.com/2/tweets/search/stream/rules";
const streamURL =
  "https://api.twitter.com/2/tweets/search/stream?tweet.fields=created_at,public_metrics&expansions=author_id";

const rules = [{value: "musk -is:retweet", place_country: "ES"}, {value: "santander -is:retweet", place_country: "ES"}];


//Configuracion del streaming
//GET stream rules
async function getRules() {
  const response = await needle("get", rulesURL, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  console.log(response.body);
  return response.body;
}

//SET stream rules
async function setRules() {
  const data = {
    add: rules,
  };

  const response = await needle("post", rulesURL, data, {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  console.log(response.body)
  return response.body;
}

//DELETE stream rules
async function deleteRules(rules) {
  if (!Array.isArray(rules.data)) {
    return null;
  }

  const ids = rules.data.map((rule) => rule.id);
  const data = {
    delete: {
      ids: ids,
    },
  };

  const response = await needle("post", rulesURL, data, {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return response.body;
}

//EMIT stream
async function streamTweets(socket) {
  const stream = await needle.get(streamURL, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  stream.on("data", (data) => {
    try {
      const json = JSON.parse(data);
      socket.emit('tweet', json, rules)
    } catch (error) {}
  });
}

//Create connection
io.on('connection', async () => {
    console.log('Cliente conectado...')

    let currentRules;

    try {
      currentRules = await getRules();
      await deleteRules(currentRules);
      await setRules();
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  
    streamTweets(io);
})


server.listen(PORT, () => console.log(`Server listen on http://localhost:${PORT}`))
