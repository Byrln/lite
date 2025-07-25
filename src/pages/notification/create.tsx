import { Box, Container, Typography } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";

import Page from "components/page";
import CreateNotification from "components/notification/create-notification";

const title = "Create Notification";

const CreateNotificationPage = () => {
    const router = useRouter();

    const handleSuccess = () => {
        // Redirect to notifications list after successful creation
        router.push('/conf/notification');
    };

    const handleCancel = () => {
        // Go back to notifications list
        router.push('/conf/notification');
    };

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>

            <Page>
                <Container maxWidth="lg">
                    <Box sx={{ pb: 3 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Create a new notification using the HoracaSoft API
                        </Typography>
                    </Box>
                    
                    <CreateNotification 
                        onSuccess={handleSuccess}
                        onCancel={handleCancel}
                    />
                </Container>
            </Page>
        </>
    );
};

export default CreateNotificationPage;