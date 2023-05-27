const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { connectToDatabase } = require('./database/db');
const { PORT, DB_HOST, DB_NAME } = require('./envconfig');
const { errorHandler } = require('./middlewares/errorHandler');

//router
const indexRouter = require('./routes/index');
const authRouter = require('./routes/authRouter');
const communityRouter = require('./routes/communityRouter');

const origins = ['http://localhost:8800'];
const corsOptions = {
  origin: origins,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

connectToDatabase()
  .then(async () => {
    app.use('/', indexRouter);

    app.listen(PORT, () => {
      console.log('PORT:', PORT);
      console.log('DB_HOST:', DB_HOST);
      console.log('DB_NAME:', DB_NAME);
      console.log(`SERVER IS RUNNING ON PORT:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

app.use('/auth', authRouter);
app.use('/community', communityRouter);
app.use(errorHandler);
