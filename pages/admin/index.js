import { useContext, useEffect } from "react";

import Page from "@/layout/Page";
import Authenticate from "@/layout/Authenticate";
import NewAdmin from "@/layout/NewAdmin";

import AdminContext from "@/context/admin";
export default function PageAdmin(props) {
  const ctx_admin = useContext(AdminContext);

  useEffect(() => {
    ctx_admin.set_ctx_data({
      title: "Dashboard",
      active_link: "/admin",
    });
  }, []);

  return <>index</>;
}

PageAdmin.getLayout = function getLayout(page) {
  return (
    <Authenticate>
      <Page animate>
        <NewAdmin>{page}</NewAdmin>
      </Page>
    </Authenticate>
  );
};

// import { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useRouter } from "next/router";

// import DashboardIcon from "@mui/icons-material/Dashboard";
// import PersonIcon from "@mui/icons-material/Person";
// import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
// import LoginIcon from "@mui/icons-material/Login";
// import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
// import GroupIcon from "@mui/icons-material/Group";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import WorkspacesIcon from "@mui/icons-material/Workspaces";

// import Admin from "@/layout/Admin";
// import Page from "@/layout/Page";
// import Loading from "@/layout/Loading";
// import { refresh, logout } from "@/store/account";
// import { useAuthMutation, usePermissionMutation } from "@/store/members";

// const def_navigations = [
//   { text: "Dashboard", icon: <DashboardIcon />, link: "/admin" },
//   { text: "Projects", icon: <GridViewRoundedIcon />, link: "/admin/projects" },
//   { text: "Team", icon: <PersonIcon />, link: "/admin/team" },
//   { text: "Roles", icon: <WorkspacesIcon />, link: "/admin/roles" },
//   { text: "Members", icon: <GroupIcon />, link: "/admin/members" },
// ];

// export default function PageAdmin(props) {
//   const router = useRouter();
//   const account = useSelector((state) => state.account);
//   const dispatch = useDispatch();
//   const [navigations, setNavigations] = useState(def_navigations);
//   const [
//     auth,
//     {
//       data: dataAuth,
//       error: errorAuth,
//       isUninitialized: isUninitializedAuth,
//       isSuccess: isSuccessAuth,
//       isError: isErrorAuth,
//     },
//   ] = useAuthMutation();
//   const [
//     permission,
//     {
//       data: dataPermission,
//       error: errorPermission,
//       isUninitialized: isUninitializedPermission,
//       isSuccess: isSuccessPermission,
//       isError: isErrorPermission,
//     },
//   ] = usePermissionMutation();
//   useEffect(() => {
//     isUninitializedAuth && auth({ token: account.token });
//   }, [isUninitializedAuth]);
//   useEffect(() => {
//     isSuccessAuth &&
//       dispatch(refresh({ user: dataAuth.user, token: dataAuth.token }));
//   }, [isSuccessAuth]);
//   useEffect(() => {
//     isErrorAuth && router.replace("/admin/signin");
//   }, [isErrorAuth]);
//   useEffect(() => {
//     if (account.user && isUninitializedPermission) {
//       permission({
//         access: {
//           projects: [account.user.role, "projects", "read", "all"],
//           members: [account.user.role, "members", "read", "all"],
//         },
//       });
//     } else if (!account.user && !isUninitializedPermission) {
//       router.replace("/admin/signin");
//     }
//   }, [!!account.user, isUninitializedPermission]);
//   useEffect(() => {
//     if (isSuccessPermission) {
//       const new_navigations = Array.of(...navigations);
//       if (!dataPermission.projects) {
//         const index = new_navigations.findIndex(
//           (navigation) => navigation.text == "Projects"
//         );
//         new_navigations.splice(index, 1);
//       }
//       if (!dataPermission.members) {
//         const index = new_navigations.findIndex(
//           (navigation) => navigation.text == "Members"
//         );
//         new_navigations.splice(index, 1);
//       }
//       setNavigations(new_navigations);
//     }
//   }, [isSuccessPermission]);

//   function onLogout() {
//     dispatch(logout());
//   }

//   if (isUninitializedAuth) {
//     return <Loading text="Initialize"></Loading>;
//   }
//   if (isSuccessAuth) {
//     if (account.user) {
//       return (
//         <Page animate={true}>
//           <Admin
//             title="Dashboard"
//             user={account.user}
//             navigations={navigations}
//             onLogout={onLogout}
//           ></Admin>
//         </Page>
//       );
//     } else {
//       return <Loading text="Loggin Out"></Loading>;
//     }
//   }
//   if (isErrorAuth) {
//     return <Loading text={`${errorAuth.data.message}: Redirecting`}></Loading>;
//   }
// }

// PageAdmin.getLayout = function getLayout(page) {
//   return (
//     <Layout>
//       <NestedLayout>{page}</NestedLayout>
//     </Layout>
//   )
// };
