var logger1 = require('./log.js')
var fs = require('fs')
// var bodyParser = require('body-parser')
module.exports = {
  name: 'customlogger',
  policy: () => {
    return (req, res, next) => { // bodyParser.json()(req, res, () => {
      // bodyParser.urlencoded({ extended: true })(req, res, () => {
      // var logId = 4
      var transLogfile = './log/request.log'
      fs.openSync(transLogfile, 'w')
      var logger = logger1.logging(transLogfile) // pass transactionid for file naming convention
      logger.info(
        'Requested At: ' + JSON.stringify(new Date()) + ',' +
        'Requested Headers: ' + JSON.stringify(req.headers) + ',' +
        'Requested Url: ' + req.originalUrl + ',' +
        'Requested IP: ' + req.ip + ',' +
        'Requested Id: ' + req.egContext.requestID
      ) // log each request
      var write = res.write
      var end = res.end
      var chunks = []

      res.write = function newWrite (chunk) {
        chunks.push(chunk)

        write.apply(res, arguments)
      }

      res.end = function newEnd (chunk) {
        if (chunk) { chunks.push(chunk) }

        end.apply(res, arguments)
      }
      // console.log(res);
      // console.log('Response snippet: '+((res.body || '').substr(0,100)));
      res.once('finish', () => {
        const statusCode = res.statusCode.toString()
        // console.log(statusCode);
        // console.log("Requested Id: " + req.egContext.requestID);
        var body = Buffer.concat(chunks).toString('utf8')
        console.log('Body Data:' + body)
        var responseLogfile = './log/response.log'
        fs.appendFileSync(responseLogfile, '')
        var logger2 = logger1.logging(responseLogfile) // pass transactionid for file naming convention
        logger2.info(
          'Requested At: ' + JSON.stringify(new Date()) + ',' +
          'Requested Code: ' + statusCode + ',' +
          'Requested body: ' + body + ',' +
          'Requested Url: ' + req.originalUrl + ',' +
          'Requested IP: ' + req.ip + ',' +
          'Requested Id: ' + req.egContext.requestID
        ) // log each response
      })
      next()
      // });
      // });
    }
  }
}
