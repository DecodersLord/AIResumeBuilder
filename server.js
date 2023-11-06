const express = require('express');
const app = express();
const dataRouter = require('./routes/dataRouter');

app.use(express.json());
app.use('/api/resumedata', dataRouter);

const port = process.env.PORT || 3000;

app.get('/', (req,res) => {
    res.send('<h1>Hello World!!!!</h1>')
})

app.listen(port, () => {
    console.log(`app is running on ${port}`);
})
