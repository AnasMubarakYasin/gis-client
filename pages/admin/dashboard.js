import { useContext, useEffect } from "react";

import AdminShell from "@/layout/AdminShell";

import AdminContext from "@/context/admin";

export default function Dashboard(props) {
  const ctx_admin = useContext(AdminContext);

  useEffect(() => {
    ctx_admin.set_ctx_data({
      title: "Dashboard",
      active_link: "/admin/dashboard",
    });
  }, []);

  return <>dashboard</>;
}

Dashboard.getLayout = AdminShell;
