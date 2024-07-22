const logger = (req, res, next) => {
  console.log("------------------------------------------------");
  console.log("Endpoint:", req.url, "Method: ", req.method);
  console.log(`Date: ${new Date().toUTCString()}`);
  console.log("Parameters: ", req.params);
  console.log("Queries: ", req.query);
  console.log("Body: ", req.body);
  console.log("------------------------------------------------");

  next();
};

export default logger;
