import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import {makeRoutes} from './routes/lib/rutil';

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

makeRoutes( express, app, '/party', path.join(__dirname, 'webfuncs') )

app.use('/', indexRouter);
app.use('/users', usersRouter);

export default app;
