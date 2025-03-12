const express = require('express');
const app = express();
const { PORT, MONGODB_URI } = require('./utils/config');
const logger = require('./utils/loggers');
const mongoose = require('mongoose');
const cors = require('cors');
//routes
const blogRouter = require('./controllers/blog');

mongoose
.connect(MONGODB_URI)
.then(() => logger.info(`Connected to MongoDB`))
.catch(e => logger.error(e));

app.use(cors());
app.use(express.json());

app.use('/api',blogRouter);


app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})