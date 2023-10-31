const router = require('express').Router();
const { Project } = require('../../models');
const withAuth = require('../../utils/auth');

const imgur = require('imgur');
app.use(fileUpload());

const { ImgurClient } = require('imgur');
const ACCESS_TOKEN = 'c4432711b892576a061e89b00b8b04b23169f0f9';
const CLIENT_ID = "027d722af8fb2e8";
const CLIENT_SECRET = '4aea09f4e753f1d1ca4730ea58098c41a10dccf1';
const REFRESH_TOKEN ='d9f3a4dedfec105ac302642186305fc72d0f8563';

const client = new ImgurClient({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  });


const response = await client.upload({
    image: createReadStream('/home/kai/dank-meme.jpg'),
    type: 'image',
  });
  console.log(response.data);