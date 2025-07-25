import { Container } from "@mui/material";
import Head from "next/head";

import Page from "components/page";
import NotificationExamples from "components/notification/notification-examples";

const title = "Notification API Examples";

const NotificationExamplesPage = () => {
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>

            <Page>
                <Container maxWidth="xl">
                    <NotificationExamples />
                </Container>
            </Page>
        </>
    );
};

export default NotificationExamplesPage;