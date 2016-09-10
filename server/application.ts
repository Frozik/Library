import * as express from "express";
import * as path from "path";

const application = express();

application.set("views", path.resolve("./wwwroot/views"));
application.set("view engine", "pug");
application.use(express.static(path.resolve("./wwwroot/public")));

process.stdout.write(path.resolve("./wwwroot/public"));

application.get("/", (request, response) => {
  response.render("index");
});

application.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});

export default application;
