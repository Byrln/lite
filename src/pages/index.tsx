import { useEffect, useState } from "react";
import Head from "next/head";

import { FrontOfficeAPI } from "lib/api/front-office";
import Dashboard from "components/dashboard/list";
import { UserAPI } from "lib/api/user";

const title = "Дашбоард | Horeca";

const DashboardApp = () => {
  const [workingDate, setWorkingDate]: any = useState(null);
  const [haveDashboard, setHaveDashboard]: any = useState(false);

  useEffect(() => {
    fetchDatas();
  }, []);

  const fetchDatas = async () => {
    let privileges = await UserAPI.getPrivileges();
    await privileges.map((action: any) =>
      action.ActionName == "DashBoard" && action.Status == true
        ? setHaveDashboard(true)
        : null
    );
    let response = await FrontOfficeAPI.workingDate();
    if (response.status == 200) {
      setWorkingDate(response.workingDate[0].WorkingDate);
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      {workingDate && haveDashboard ? (
        <Dashboard workingDate={workingDate} />
      ) : (
        <div className="text-center p-8">
          Хандах эрх байхгүй байна
        </div>
      )}
    </>
  );
};

export default DashboardApp;
