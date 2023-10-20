import { Grid, Typography } from "@mui/material";
import Poll from "mdi-material-ui/Poll";

import { DashboardSWR } from "lib/api/dashboard";
import DashboardCard from "components/common/dashboard-card";

const Dashboard = () => {
    const { data, error } = DashboardSWR();

    const randColor = () => {
        return (
            "#" +
            Math.floor(Math.random() * 16777215)
                .toString(16)
                .padStart(6, "0")
                .toUpperCase()
        );
    };

    return (
        <>
            {data &&
                data.map((element: any) => (
                    <Grid
                        container
                        spacing={2}
                        style={{ marginBottom: "20px" }}
                        key={element[0].ParameterGroupName}
                    >
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                {element[0].ParameterGroupName}
                            </Typography>
                        </Grid>

                        {element.map((childElement: any) => (
                            <Grid item xs={3} key={childElement.ParameterName}>
                                <DashboardCard
                                    title={childElement.ParameterName}
                                    stats={childElement.ParameterValue}
                                    subtitle={childElement.ParameterGroupName}
                                    icon={<Poll />}
                                    color={randColor()}
                                />
                            </Grid>
                        ))}
                    </Grid>
                ))}
        </>
    );
};

export default Dashboard;
