/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})



Route.post('/sign-up', 'AuthController.signUp');
Route.post('/sign-in', 'AuthController.signIn');



Route.group(() => {
  
  Route.get("/me", "MeController.getProfile");
  Route.patch("/me/:id", "MeController.updateProfile");
  Route.delete("/me/:id", "MeController.leave");

  Route.post("/categories", "CategoriesController.create");
  Route.get("/categories", "CategoriesController.list");
  Route.patch("/categories/:id", "CategoriesController.update");
  Route.delete("/categories/:id", "CategoriesController.delete");
  //Route.get("/categories/:userId", "CategoriesController.read");
  
  // Route.post('/categories/:category_id/todos', '' );
  // Route.get("/categories/:category_id/todos", "");
  // Route.patch("/categories/:category_id/todos/:id", "");
  // Route.delete("/categories/:category_id/todos/:id", "");

  // Route.post("/todos", ""); // { category_id: 1, content: '' }
  // Route.get("/todos", ""); // todos?category_id=1
  // Route.patch("/todos/:id", "");
  // Route.delete("/todos/:id", "");
  Route.post("/categories/:id/todos", "TodosController.create");
  Route.get("/categories/:id/todos", "TodosController.read");
  Route.get("/todos", "TodosController.list");
  Route.patch("/todos/:id", "TodosController.update");
  Route.delete("/todos/:id", "TodosController.delete");
  

}).middleware("auth");
