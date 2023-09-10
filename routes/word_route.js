
import express from "express"

import {updateWord , deleteWord , searchAn , searchPre , searchSyn} from "../controllers/word_controller.js"

const router = express.Router();


router.patch("/words/update/:id" , updateWord)
router.delete("/words/delete/:id" , deleteWord)
router.get("/words/search/:prefix" , searchPre)
router.get("/words/search/synonyms/:prefix" , searchSyn)
router.get("/words/search/antonyms/:prefix" , searchAn)

export default router