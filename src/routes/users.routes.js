const { Router } = require("express");
const UserControllers = require("../controllers/UserControllers");

const userControllers = new UserControllers();
const usersRouter = Router();

function myMiddleware(request, response, next) {
  // console.log("I'm a middleware");
  next(); //function to pass to next function, in this case is "userControllers.create"
}

//:id is a route parameter (For add new parameters, is necessary add "/:(parameter name)" ), if you put the the route parameter like this, is obligatory to put a value in the route. But, if you use the Query Params, you can acessa the paramms but it's not obligatory to put in url.
// usersRouter.use(myMiddleware); //this middleware will be used in all routes
usersRouter.post("/", userControllers.create);
usersRouter.put("/:id", userControllers.update);

module.exports = usersRouter;
