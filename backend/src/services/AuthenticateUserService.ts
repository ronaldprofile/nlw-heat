/**
 * Receber o código [x]
 * Recuperar o access_token no github [x]
 * Verificar se o user existe no db [x]
 * if => gera um token [x]
 * else => cria no db e gera um token [x]
 * Retornar o token com as infos do user [x]
 */

import axios from "axios";
import prismaClient from "../prisma";
import { sign } from "jsonwebtoken";

interface IAccessToken {
  access_token: string;
}

interface IUserGithub {
  id: number;
  avatar_url: string;
  name: string;
  login: string;
}

class AuthenticateUserService {
  async execute(code: string) {
    const url = "https://github.com/login/oauth/access_token";

    const { data: IAccessTokenResponse } = await axios.post<IAccessToken>(
      url,
      null,
      {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_SECRET_ID,
          code
        },
        headers: {
          Accept: "application/json"
        }
      }
    );

    const response = await axios.get<IUserGithub>(
      `https://api.github.com/user`,
      {
        headers: {
          authorization: `Bearer ${IAccessTokenResponse.access_token}`
        }
      }
    );

    const { name, login, id, avatar_url } = response.data;

    // check if the user exists
    let user = await prismaClient.user.findFirst({
      where: {
        github_id: id
      }
    });

    // save user in db
    if (!user) {
      user = await prismaClient.user.create({
        data: {
          github_id: id,
          login,
          avatar_url,
          name
        }
      });
    }

    // generate token
    const token = sign(
      {
        user: {
          name: user.name,
          avatar_url: user.avatar_url,
          id: user.id
        }
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: "1d"
      }
    );

    return { token, user };
  }
}

export { AuthenticateUserService };
