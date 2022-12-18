import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Category from "App/Models/Category";
import Todo from "App/Models/Todo";

export default class TodosController {

  //유저별 (카테고리, 할 일)전체 목록 보기
  async list({ auth, response }: HttpContextContract) {
    const userId = auth.user!.id;
    const todos = await Todo.query()
      .where({
        user_id: userId,
      })
      .exec();

    return response.ok(todos);
  }
  
  // 카테고리별 todo 리스트 보기 완료 (아이디별 전체 목록은 필요한가?)
  async listcategory({ auth, params, response }: HttpContextContract) {
    const { id } = params;
    const userId = auth.user!.id;
    const category = await Category.findOrFail(id);
    const todos = await Todo.query()
      .where({
        user_id: userId,
        category_id: category.id,
      })
      .exec();

    return response.ok(todos);
  }

  // todo 작성 완료

  async create({ auth, params, request, response }: HttpContextContract) {
    const { id } = params;
    const content = request.input("content");
    const category = await Category.findOrFail(id);
    const userId = auth.user!.id;

    if (category.userId !== userId) {
      // <== 할 일을 작성시, 다른 유저가 작성한 카테고리에도 작성이 된다. 그걸 방지한다.
      return response.forbidden({
        message: "이 카테고리에 작성할 권한이 없습니다.",
      });
    }

    if (!content) {
      return response.badRequest({
        message: "내용을 입력 해야합니다.",
      });
    }

    const exist = await Todo.query()
      .where({
        user_id: auth.user.id,
        category_id: category.id,
        content,
      })
      .first();
    if (exist) {
      return response.badRequest({
        message: "같은 이름의 할 일 목록이 있습니다.",
      });
    }

    const todo = await Todo.create({
      userId,
      categoryId: category.id,
      content,
    });

    return todo;
  }

  //todo 수정

  async update({ auth, params, request, response }: HttpContextContract) {
    // <-- bouncer를 사용하였지만, 삭제 권한 유효성 검사 때문에 포기. 방법이 있을것이다.
    const { id } = params;
    const todo = await Todo.findOrFail(id);
    const userId = auth.user!.id;

    //await bouncer.with("TodoPolicy").authorize("update", todo);

    const content = request.input("content");
    todo.content = content;
    if (!content) {
      response.badRequest({
        message: "내용을 입력해 주세요.",
      });
      return;
    }

    if (todo.userId !== userId) {
      response.forbidden({
        message: "수정 할 권한이 없습니다.",
      });
      return;
    }

    await todo.save();
    return todo;
  }

  //todo 삭제 완료
  async delete({ params, auth, response }: HttpContextContract) {
    // <-- bouncer를 사용하였지만, 삭제 권한 유효성 검사 때문에 포기. 방법이 있을것이다. 우린 늘 찾아왔으니...
    const { id } = params;
    const todo = await Todo.findOrFail(id);
    const userId = auth.user!.id;

    //await bouncer.with("TodoPolicy").authorize("delete", todo);

    if (todo.userId !== userId) {
      response.forbidden({
        message: "삭제 할 권한이 없습니다.",
      });
      return;
    }

    await todo.delete();
    return "삭제 되었습니다.";
  }
}
