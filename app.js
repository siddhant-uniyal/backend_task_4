import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import {config} from "dotenv"
export const app = express();

app.use(bodyParser.json())

import wordRouter from "./routes/word_route.js"


config({
    path : "./data/config.env",
})

app.use(wordRouter)











