const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

module.exports = (duration) => (req, res, next) => {
  //if req is GET
  //if req is not GET, call next
  if (req.method !== "GET") {
    console.log(`Cannot cache not GET method`);
    return next();
  }
  //check if key exist in cache
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);

  //if exist, send cache result
  if (cachedResponse) {
    console.log(`Cache hit for ${key}`);
    res.send(cachedResponse);
  } else {
    console.log(`cache miss for ${key}`);
    res.originalSend = req.send;
    res.send = (body) => {
      res.originalSend(body);
      cache.set(key, body, duration);
    };
    next();
  }
};
