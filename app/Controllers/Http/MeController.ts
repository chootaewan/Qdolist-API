import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class MeController {
  async getProfile({ auth }: HttpContextContract) {
    return auth.user;
  }

  //회원 정보 수정

  async updateProfile({
    auth,
    params,
    request,
    response,
  }: HttpContextContract) {
    const id = params.id;
    const name = request.input("name");
    const user = await User.find(id);
    const userId = auth.user!.id;

    if (user.id !== userId) {
      return response.forbidden({
        message: "수정 권한이 없습니다.",
      });
    }

    if (!name) {
      return response.badRequest({
        message: "이름을 입력하세요.",
      });
    }

    if (name.length < 2) {
      return response.badRequest({
        message: "이름을 2자 이상 입력하세요.",
      });
    }

    user.name = name;
    auth.user!.merge(params);
    await user.save();
    return `이름이 ${name}으로 변경 되었습니다.`;
  }

  // 회원 탈퇴

  async leave({ auth }: HttpContextContract) {
    await auth.user!.delete();
    return `탈퇴가 성공적으로 이루어졌습니다.`;
  }
}
