const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
require('dotenv').config();

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

const dataRouter = express.Router();
dataRouter.use(cors());


async function getAIGeneratedResponse(requestedGenerateMessage){
    
    console.log(requestedGenerateMessage);
    let testVar = Object.keys(requestedGenerateMessage).toString();
    let queryString = '';
    if(!requestedGenerateMessage){
        return res.status(400).send('Missing input query parameter.');
    }
    try{
        console.log('switch ' + testVar);
        switch (testVar){
            case 'summary':
                queryString = 'generate a resume summary for ' + requestedGenerateMessage.summary;
                break;
            case 'experience':
                console.log('Here in experience');
                queryString = `generate a job experience description for a resume working as a ${requestedGenerateMessage.experience.role} performed task (max 3 bullet points) ` + requestedGenerateMessage.experience.description;
                break;
        }
        console.log(queryString);
        //const generatedSummary = '';
        const generatedSummary = await openai.chat.completions.create({
            messages: [{role: 'user', content: queryString}],
            model: 'gpt-3.5-turbo',
        });

        //const aiGeneratedSummary = '';

        const aiGeneratedSummary = generatedSummary.choices[0].message.content;

        console.log("completion", aiGeneratedSummary);

        return aiGeneratedSummary;
    }catch(err){
        console.log(err);
    }
}


dataRouter.get('/summary', (req,res) => {
    async function getSummary(){
        console.log(req.body.summary);
        const aiGeneratedSummary = await getAIGeneratedResponse({summary: req.body.summary});
        res.send(aiGeneratedSummary);
    }
    
    getSummary();
})


dataRouter.get('/experience', (req,res) => {
    let aiGeneratedExperienceDesc = [];
    async function getExperience(){
        let experiences = req.body.experience;
        let aiGeneratedExperienceDesc = [];
        for (let i = 0; i < experiences.length; i++) {
            let role = experiences[i].role;
            for (let j = 0; j < experiences[i].description.length; j++) {
                let requestedExperience = {
                    experience : {
                        role: role, description: experiences[i].description[j]
                    }
                };
                aiGeneratedExperienceDesc.push(await getAIGeneratedResponse(requestedExperience));
            }
        }
        res.send(aiGeneratedExperienceDesc);
    }
    
    getExperience();
})

module.exports = dataRouter;