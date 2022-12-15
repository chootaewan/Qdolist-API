import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Category from "App/Models/Category";

export default class CategoriesController {
  // 키테고리 목록
  async list({ auth, response }: HttpContextContract) {
    const userId = auth.user!.id;
    const categories = await Category.query() //<-query를 이용해서 user_id를 불러 올수있다.
      .where({
        user_id: userId,
      })
      .exec(); //paginate(1,12); 사용 예
    // .exec() .get() .paginate() <- 이렇게 목록을 불러 올수도 있다. paginate는 중요하다. .all()을 쓰면 모두 불러오기에 계정마다 보여지는게 되지 않는다.

    return response.ok(categories);
  }
  
  //카테고리 작성
  async create({ auth, request, response }: HttpContextContract) {
    const content = request.input("content");
    const userId = auth.user!.id;
    if (!content) {
      // content 가 없으면?
      return response.badRequest({
        message: "내용을 입력 해야합니다.",
      });
    }

    const exist = await Category.query()
      .where({
        user_id: userId,
        content,
      })
      .first();
    if (exist) {
      // content 가 중복이면? 사용자 개개인의 중복이 필요, 유저아이디가 따라야 한다.
      return response.badRequest({
        message: "같은 이름의 카테고리가 있습니다.",
      });
    }

    const category = await Category.create({
      userId,
      content,
    });

    return category;
  }

  //카테고리 수정
  async update({ auth, params, request, response }: HttpContextContract) {
    const id = params.id;
    const userId = auth.user!.id;
    const content = request.input("content");
    const category = await Category.find(id);

    if (!category) {
      response.notFound({
        message: "수정 할 수 있는 카테고리가 없습니다.",
      });
      return;
    }

    if (category.userId !== userId) {
      // <- 이렇게 조건문에 가져와서 유저별 접근을 허용,불허용 할수있게 할수 있다.
      response.forbidden({
        message: "수정 할 수 있는 권한이 없습니다.",
      });
      return;
    }

    category.content = content;
    await category.save();

    return category;
  }

  //카테고리 삭제
  async delete({ auth, params, response }) {
    const id = params.id;
    const userId = auth.user!.id;
    const category = await Category.find(id);

    if (!category) {
      response.notFound({
        message: "카테고리를 찾지 못했습니다.",
      });
      return;
    }

    if (category.userId !== userId) {
      response.forbidden({
        message: "삭제 할 권한이 없습니다.",
      });
      return;
    }

    await category.delete();

    return response.ok({ message: "카테고리가 삭제 되었습니다." });
  }
}
