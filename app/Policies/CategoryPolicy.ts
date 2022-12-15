import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Category from 'App/Models/Category';
import User from 'App/Models/User';

export default class CategoryPolicy extends BasePolicy {
  public async update(user: User, category: Category) {
    return user.id === category.userId;
  }

  public async delete(user: User, category: Category) {
    return user.id === category.userId;
  }
}
