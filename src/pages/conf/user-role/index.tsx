import { Box, Grid, Container, Typography } from "@mui/material";
import Head from "next/head";

import Page from "components/page";
import UserRoleList from "components/conf/user-role/list";

const title = "Хэрэглэгчийн төрлийн жагсаалт";

const Index = () => (
  <>
    <Head>
      <title>{title}</title>
    </Head>

    <Page>
      <Container maxWidth="xl" className="py-4">
        <Box sx={{ pb: 1 }}>
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <UserRoleList title={title} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  </>
);

export default Index;
