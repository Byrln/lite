import { useEffect, useState } from "react";
import { Grid, Container } from "@mui/material";
import Head from "next/head";

import MyCalendar from "components/new-calendar/test2";
import { FrontOfficeAPI } from "lib/api/front-office";
import { RoomStatus1SWR } from "lib/api/room-status";

const title = "Календар";

const Index = () => {
  const { data, error } = RoomStatus1SWR({ CalendarShow: true });

  const [workingDate, setWorkingDate]: any = useState(null);

  useEffect(() => {
    fetchDatas();
  }, []);

  const fetchDatas = async () => {
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

      <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
        {workingDate && (
          <MyCalendar
            workingDate={workingDate}
          />
        )}

        {/* {workingDate && <HandsOnTable workingDate={workingDate} />} */}
      </div>

      {/* <Grid container direction="row" className="mt-2">
                        <Grid
                            item
                            xs={12}
                            style={{ display: "flex", flexWrap: "wrap" }}
                        >
                            {data &&
                                data.map((element: any, index: any) => (
                                    <div
                                        key={element.RoomStatusID}
                                        className="mr-3 pl-1 pr-1 mb-1"
                                        style={{
                                            borderRadius: "4px",
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "15px",
                                                height: "15px",
                                                backgroundColor: `#${element.StatusColor}`,
                                                borderRadius: "4px",
                                            }}
                                            className="mr-1"
                                        ></div>
                                        {element.StatusCode == "StatusArrived"
                                            ? "Ирсэн"
                                            : element.StatusCode ==
                                              "StatusCheckedOut"
                                            ? "Гарсан"
                                            : element.StatusCode ==
                                              "StatusDueOut"
                                            ? "Гарах"
                                            : element.StatusCode ==
                                              "StatusConfirmReservation"
                                            ? "Баталгаажсан"
                                            : element.StatusCode ==
                                              "StatusMaintenanceBlock"
                                            ? "Блок"
                                            : element.StatusCode ==
                                              "StatusStayOver"
                                            ? "Дахин хонох"
                                            : element.StatusCode ==
                                              "StatusDayUseReservation"
                                            ? "Өдрөөр захиалга"
                                            : element.StatusCode ==
                                              "StatusDayUse"
                                            ? "Өдрөөр ашиглах"
                                            : element.StatusCode}
                                    </div>
                                ))}
                        </Grid>
                    </Grid> */}
    </>
  );
};

export default Index;
