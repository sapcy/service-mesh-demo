let http = require("http");
let url = require("url");

const VERSION = process.env.VERSION ? process.env.VERSION : "v1";
let log = console.log;

console.log = function () {
  let first_parameter = arguments[0];
  let other_parameters = Array.prototype.slice.call(arguments, 1);

  function formatConsoleDate () {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] `;
  }

  log.apply(console, [formatConsoleDate() + first_parameter].concat(other_parameters));
};


console.log(`SHOW ENV`);
console.log(`* VERSION=${VERSION}`);

if (process.env.RANDOM_ERROR)
  console.log(`* RANDOM_ERROR=${process.env.RANDOM_ERROR * 100}%`);
if (process.env.LOG) console.log(`* LOG=${process.env.LOG}`);

/* ------------------------------------------------------------------------
    - uri 가 있다면 uri response Write
    - uri:/error 요청하면 503 에러 발생
------------------------------------------------------------------------ */
http
  .createServer(async (req, res) => {
    const { headers } = req;
    const jsonHeaders = JSON.stringify({
      headers
    });
    const RESPONSE_200 = `200 Response - ${VERSION}`;
    const RESPONSE_503 = `503 Response - ${VERSION} \n`;
    const RESPONSE_FAULT_INJECTION_503 = `503 Response - ${VERSION} (random) \n`;
    const CONSOLE_LOG_200 = `200 Response - ${VERSION} : ${jsonHeaders}`;
    const CONSOLE_LOG_503 = `503 Response - ${VERSION} : ${jsonHeaders} (random)`;
    const CONSOLE_LOG_FAULT_INJECTION_503 = `503 Response - ${VERSION} : ${jsonHeaders}`;


    if (req.url && req.url == "/error") {
      res.writeHead(503, { "Content-Type": "text/plain" });
      res.write(RESPONSE_503);
      if (process.env.LOG) console.log(CONSOLE_LOG_FAULT_INJECTION_503);
    } else if (
      process.env.RANDOM_ERROR &&
      Math.random() >= 1 - process.env.RANDOM_ERROR
    ) {
      await sleep(1000);
      res.writeHead(503, { "Content-Type": "text/plain" });
      res.write(RESPONSE_FAULT_INJECTION_503);
      if (process.env.LOG)
        console.log(CONSOLE_LOG_503);
    } else {
      res.writeHead(200, { "Content-Type": "text/plain" });
      let query = url.parse(req.url, true).query;
      if (query.delay) await sleep(query.delay); // http://demo-server:8080/?delay=1000  --> sleep(1000);

      res.write(RESPONSE_200);
      res.write(
        (req.url == "/" ? "" : ` (uri=${req.url})`) + "\n"
      );

      if (process.env.LOG) console.log(CONSOLE_LOG_200);
    }
    res.end();
  })
  .listen(8080);

function sleep(t) {
  return new Promise((resolve) => setTimeout(resolve, t));
}
