import { Box, Grid, Container, Typography } from "@mui/material";
import Head from "next/head";
import { useIntl } from "react-intl";
import Page from "components/page";
import AmenityList from "components/room/amenity/list";

const Index = () => {
  const intl = useIntl();

  const title = intl.formatMessage({
    id: "PageTitleRoomAmenities",
  });

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <Page>
        <Container maxWidth="xl">
          <Box sx={{ pb: 1 }}>
            <Typography variant="h6">{title}</Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <AmenityList title={title} />
            </Grid>
          </Grid>
        </Container>
      </Page>
    </>
  );
};

export default Index;
