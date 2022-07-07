import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSigninMutation } from "@/store/members";
import { login, logout, refresh } from "@/store/account";
import { useAuthMutation } from "@/store/members";

export function useAccount() {
  const account = useSelector((state) => state.account);
  const dispatch = useDispatch();
  const [signin, { data, error, isLoading, isSuccess, isError }] =
    useSigninMutation();
  // const [
  //   auth,
  //   {
  //     data: dataAuth,
  //     error: errorAuth,
  //     isUninitialized: isUninitializedAuth,
  //     isSuccess: isSuccessAuth,
  //     isError: isErrorAuth,
  //   },
  // ] = useAuthMutation();
  useEffect(() => {
    if (isSuccess) {
      // dispatch(refresh({ user: dataAuth.user, token: dataAuth.token }));
      dispatch(login({ user: data.user, token: data.token, remember: true }));
    }
  }, [isSuccess, isError]);
  return [account, { login, logout, refresh, signin, error, isLoading, isSuccess, isError}];
}
