import { TokenResponse } from "@/types";
import { Response } from "express";
/**
 * @utility setTokenCookies
 * @description Utility function to securely bind tokens to response's cookies.
 * This function should be used in middlewares, particularly in the tokens interceptors
 * @param response Express Response object
 * @param tokens Tokens to be bound to the response's cookies
 */
export const setTokenCookies = (response: Response, tokens: TokenResponse) => {
  response.cookie("access_token", tokens.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, // 1 hour duration
  });
  response.cookie("refresh_token", tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week duration
  });
};
/**
 * @utility clearTokenCookies
 * @description Utility function to clear tokens from response's cookies.
 * This function should be used in middlewares, particularly in the tokens interceptors
 * @param response Express Response object
 */
export const clearTokenCookies = (response: Response) => {
  response.clearCookie("access_token");
  response.clearCookie("refresh_token");
};
