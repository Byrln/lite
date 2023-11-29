import { useEffect, useState } from "react";
import { Box, Grid, Container, Typography } from "@mui/material";
import Head from "next/head";
import dynamic from "next/dynamic";

import Page from "components/page";
// import NewCalendar from "components/new-calendar";
import { FrontOfficeAPI } from "lib/api/front-office";

// const Scheduler = dynamic(() => import("components/Scheduler"), { ssr: false });

const title = "Календар";

const data = [
    {
        start_date: "2020-06-10 6:00",
        end_date: "2020-06-10 8:00",
        text: "Event 1",
        id: 1,
    },
    {
        start_date: "2020-06-13 10:00",
        end_date: "2020-06-13 18:00",
        text: "Event 2",
        id: 2,
    },
];

const Index = () => {
    const { currentTimeFormatState, messages } = {
        currentTimeFormatState: true,
        messages: [],
    };

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

    const data = [
        {
            start_date: "2020-06-10 6:00",
            end_date: "2020-06-10 8:00",
            text: "Event 1",
            id: 1,
        },
        {
            start_date: "2020-06-13 10:00",
            end_date: "2020-06-13 18:00",
            text: "Event 2",
            id: 2,
        },
    ];

    const logDataUpdate = (action: any, ev: any, id: any) => {
        const text = ev && ev.text ? ` (${ev.text})` : "";
        const message = `event ${action}: ${id} ${text}`;
        // addMessage(message);
        console.log("message", message);
    };

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <Page>
                {/* {workingDate && (
                    <NewCalendar
                    //@ts-ignore
                    />
                )} */}

                {/* <MyScheduler /> */}
            </Page>
        </>
    );
};

export default Index;
