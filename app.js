let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let router = require('./routes/index');
let mysql = require("mysql");

function connectDb(){
    db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "803923",
    database: "rollingball"
  });
  db.connect(handlerDbError);
  db.on("error", handlerDbError);
}
function handlerDbError (err){
  if (err){
    if (err.code === "PROTOCOL_CONNECTION_LOST"){
       connectDb();
    } else{
      console.error(err.stack || err);
    }
  }
}
let db = null;
connectDb();

db.query(
  "CREATE TABLE IF NOT EXISTS `rank` ("
  + "`sid` int(8) unsigned NOT NULL AUTO_INCREMENT, "        
  + "`fbid` bigint(20) unsigned DEFAULT 0000000000, "
  + "`fbicon` varchar(255) DEFAULT '', "
  + "`fbname` varchar(100) DEFAULT '', "
  + "`score` INT(10) unsigned DEFAULT 0, "
  + "PRIMARY KEY(`sid`))"
  + "AUTO_INCREMENT=10000000"
  + ";", 
  (err)=>{
      if (err){
          console.log(err.message);
          throw err;
      }
    }
);

let app = express();

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    // 设置/routes/index文件为总的路由控制文件
    // 在index文件中再进行统一的路由分发
    router(app, db);

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      next(createError(404));
    });

    // error handler
    app.use(function(err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });

module.exports = app;
