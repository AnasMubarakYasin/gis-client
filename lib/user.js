import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSigninMutation } from "@/store/members";
import { login, logout, refresh } from "@/store/user";

/**
 *
 * @returns {[
 * Client.Store.User,
 * {login: Function, logout: Function, refresh: Function,
 * signinMutation: {signin: Function, errorSignin: Object, isLoadingSignin: boolean, isSuccessSignin: boolean, isErrorSignin: boolean}
 * }
 * ]}
 */
export function useUser() {
  /**
   * @type {Client.Store.User}
   */
  // @ts-ignore
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [
    signin,
    {
      data: dataSignin,
      error: errorSignin,
      isLoading: isLoadingSignin,
      isSuccess: isSuccessSignin,
      isError: isErrorSignin,
    },
  ] = useSigninMutation();
  useEffect(() => {
    if (isSuccessSignin) {
      dispatch(
        login({
          account: dataSignin.user,
          token: dataSignin.token,
          remember: true,
        })
      );
      console.log("dispatch login");
    }
  }, [isSuccessSignin]);
  return [
    user,
    {
      login: (value) => dispatch(login(value)),
      logout: () => dispatch(logout()),
      refresh: (value) => dispatch(refresh(value)),
      signinMutation: {
        signin,
        errorSignin,
        isLoadingSignin,
        isSuccessSignin,
        isErrorSignin,
      },
    },
  ];
}
