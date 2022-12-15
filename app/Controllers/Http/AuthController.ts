import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class AuthController {
  async signUp({ request, response }: HttpContextContract) {
    const params = request.only(["uid", "password", "name"]);

    if (!params.uid) {
      return response.badRequest({
        message: "아이디는 필수 입력 항목입니다.",
      });
    }

    if (!params.password) {
      return response.badRequest({
        message: "패스워드는 필수 입력 항목입니다.",
      });
    }

    if (!params.name) {
      return response.badRequest({
        message: "이름은 필수 입력 항목입니다.",
      });
    }

    if (params.password.length < 4 || params.password.length > 15) {
      return response.badRequest({
        message: "패스워드는 4~15자리 이내로 입력해야 합니다.",
      });
    }

    const exist = await User.query().where("uid", params.uid).first();
    if (exist) {
      return response.badRequest({
        message: "이미 사용중인 아이디입니다.",
      });
    }

    const user = await User.create(params);

    return user;
  }

  async signIn({ auth, request, response }: HttpContextContract) {
    const params = request.only(["uid", "password"]);

    if (!params.uid) {
      return response.badRequest({
        message: "아이디는 필수 입력 항목입니다.",
      });
    }

    const exist = await User.query().where("uid", params.uid).first();
    if (!exist) {
      return response.badRequest({
        message: "없는 아이디 입니다.",
      });
    }

    if (!params.password) {
      return response.badRequest({
        message: "패스워드는 필수 입력 항목입니다.",
      });
    }

    const user = await User.findByOrFail("uid", params.uid);
    const token = await auth.use("api").attempt(params.uid, params.password); // attempt가 자동 인증을 해준다.
    return {
      user,
      token,
    };
  }
}
