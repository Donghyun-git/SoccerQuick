const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const cron = require('node-cron');
const deleteExpiredWithdrawnUsers = require('./utils/deleteExpiredWithdrawnUsers');
const { connectToDatabase } = require('./database/db');
const { PORT, DB_HOST, DB_NAME } = require('./envconfig');
const { errorHandler } = require('./middlewares/errorHandler');

//router
const indexRouter = require('./routes/index');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');
const communityRouter = require('./routes/communityRouter');
const groundRouter = require('./routes/groundRouter');
const reviewRouter = require('./routes/reviewRouter');

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
    cron.schedule('0 0 * * *', async () => {
      console.log('스케줄러 실행중.');
      await deleteExpiredWithdrawnUsers();
    });

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
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/community', communityRouter);
app.use('/ground', groundRouter);
app.use('/review', reviewRouter);
app.use(errorHandler);
