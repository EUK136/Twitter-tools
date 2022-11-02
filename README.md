![Project Status](https://img.shields.io/badge/Status-Developing-green) ![GitHub last commit](https://img.shields.io/github/last-commit/EUK136/Twitter-tools) ![GitHub package.json version](https://img.shields.io/github/package-json/v/EUK136/Twitter-tools) ![GitHub top language](https://img.shields.io/github/languages/top/EUK136/Twitter-tools)

---

# Twitter Stream & User Info

To use the repository you will need an account on [Twitter developer portal](https://developer.twitter.com/en), create a .env file where to enter the Token, you have an example in the "env_example" file.

To use this repository first clone it

```
git clone https://github.com/EUK136/tweet-streaming.git
```

After install all nedded package wiht the following command

```
npm install
```

## User Info

To get info about a user use the following command

```
npm run user <username>
```

## Tweet stream

### Setting rules stream

It is necessary to indicate the rules that are going to be followed to filter the tweets, this is achieved by editing the variable ` const rules = [{ }]` You can find a guide on how to create the rules in the following link [Twitter rules creation guide](https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/integrate/build-a-rule)

You can use the stream in two ways, through a web interface or in the terminal

### Web interface

```
npm run stream
```

### Terminal

```
npm run sconsole
```