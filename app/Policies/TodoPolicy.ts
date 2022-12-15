import { BasePolicy } from "@ioc:Adonis/Addons/Bouncer";
import Todo from "App/Models/Todo";
import User from "App/Models/User";

export default class TodoPolicy extends BasePolicy {
  public async create(user: User, todo: Todo) {
    return user.id === todo.userId;
  }

  public async update(user: User, todo: Todo) {
    return user.id === todo.userId;
  }

  public async delete(user: User, todo: Todo) {
    return user.id === todo.userId;
  }
}
