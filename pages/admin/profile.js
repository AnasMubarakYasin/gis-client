import { useContext, useEffect } from "react";

import AdminShell from "@/layout/AdminShell";

import AdminContext from "@/context/admin";

export default function Profile(props) {
  const ctx_admin = useContext(AdminContext);

  useEffect(() => {
    ctx_admin.set_ctx_data({
      title: "Profile",
      active_link: "/admin/profile",
    });
  }, []);

  return <>profile</>;
}

Profile.getLayout = AdminShell;
