import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";

// import DashboardIcon from "@mui/icons-material/Dashboard";
// import PersonIcon from "@mui/icons-material/Person";
// import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
// import GroupIcon from "@mui/icons-material/Group";
// import WorkspacesIcon from "@mui/icons-material/Workspaces";

import Loading from "@/layout/Loading";
import DialogPassword from "@/components/DialogPassword";
import ContextAuthenticate from "@/context/authenticate";
import { refresh } from "@/store/user";
import { useAuthQuery, useSigninMutation } from "@/store/members";

// const def_navigations = [
//   { text: "Dashboard", icon: <DashboardIcon />, link: "/admin" },
//   { text: "Projects", icon: <GridViewRoundedIcon />, link: "/admin/projects" },
//   { text: "Team", icon: <PersonIcon />, link: "/admin/team" },
//   { text: "Roles", icon: <WorkspacesIcon />, link: "/admin/roles" },
//   { text: "Members", icon: <GroupIcon />, link: "/admin/members" },
// ];

export default function Authenticate(props) {
  const router = useRouter();
  /**
   * @type {Client.Store.User}
   */
  // @ts-ignore
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const {
    data: dataAuth,
    error: errorAuth,
    isUninitialized: isUninitializedAuth,
    isSuccess: isSuccessAuth,
    isError: isErrorAuth,
  } = useAuthQuery({ token: user.token }, { skip: user.isLoggedIn });

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
  const [openDialogPass, setOpenDialogPass] = useState(false);
  const context = useMemo(
    () => ({
      open_signin: (value) => {
        setOpenDialogPass(value);
      },
      user: {},
    }),
    []
  );

  useEffect(() => {
    if (isSuccessAuth) {
      if (user.token != dataAuth.token) {
        dispatch(refresh({ account: dataAuth.user, token: dataAuth.token }));
      }
    }
  }, [isSuccessAuth]);
  useEffect(() => {
    isErrorAuth && router.replace("/admin/signin");
  }, [isErrorAuth]);
  useEffect(() => {
    user.isLoggedOut && router.replace("/admin/signin");
  }, [user.isLoggedOut]);
  useEffect(() => {
    if (isLoadingSignin) {
      setOpenDialogPass(false);
    }
    if (isSuccessSignin) {
      if (user.token != dataSignin.token) {
        dispatch(
          refresh({ account: dataSignin.user, token: dataSignin.token })
        );
      }
    }
    if (isErrorSignin) {
      setOpenDialogPass(true);
    }
  }, [isLoadingSignin, isSuccessSignin, isErrorSignin]);

  if (isUninitializedAuth) {
    return (
      <>
        <ContextAuthenticate.Provider value={context}>
          {props.children}
        </ContextAuthenticate.Provider>
        <DialogPassword
          open={openDialogPass}
          onSubmit={({ name, password }) => {
            signin({ data: { name, password } });
          }}
          onClose={() => setOpenDialogPass(false)}
          // @ts-ignore
          values={{ name: user.account.name, password: "" }}
          // @ts-ignore
          errors={isErrorSignin ? { password: errorSignin.data.message } : {}}
        ></DialogPassword>
      </>
    );
  }
  if (isSuccessAuth) {
    if (user.isLoggedIn) {
      return (
        <>
          <ContextAuthenticate.Provider value={context}>
            {props.children}
          </ContextAuthenticate.Provider>
          <DialogPassword
            open={openDialogPass}
            onSubmit={({ name, password }) => {
              signin({ data: { name, password } });
            }}
            onClose={() => setOpenDialogPass(false)}
            // @ts-ignore
            values={{ name: user.account.name, password: "" }}
            // @ts-ignore
            errors={isErrorSignin ? { password: errorSignin.data.message } : {}}
          ></DialogPassword>
        </>
      );
    }
    if (user.isLoggedOut) {
      return <Loading text="Logging Out"></Loading>;
    }
    return <Loading text="Something Wrong"></Loading>;
  }
  if (isErrorAuth) {
    // @ts-ignore
    return <Loading text={`${errorAuth.data.message}: Redirecting`}></Loading>;
  }
}
