import { Grid, Divider, Box } from "@mui/material";
import moment from "moment";
import { LoadingButton } from "@mui/lab";

import RoomSelect from "../select/room";
import RoomAssign from "./room-assign";

const RoomAssignGroup = ({
    entities,
    additionalMutateUrl,
    customRerender,
}: any) => {
    return (
        <>
            {entities &&
                entities.map((item: any) => (
                    <Grid container spacing={2} key={item.resourceId}>
                        <Grid item xs={12} sm={6}>
                            <Box
                                sx={{
                                    display: "flex",
                                    width: "100%",
                                    flexWrap: "wrap",
                                    fontSize: "14px",
                                }}
                                className="mb-1"
                            >
                                <div className="mr-1">Зочны нэр : </div>
                                <div style={{ fontWeight: "600" }}>
                                    {item.title}
                                </div>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    width: "100%",
                                    flexWrap: "wrap",
                                    fontSize: "14px",
                                }}
                                className="mb-1"
                            >
                                <div className="mr-1">Ирэх огноо : </div>
                                <div style={{ fontWeight: "600" }}>
                                    {moment(item.startDate).format(
                                        "YYYY-MM-DD"
                                    )}
                                </div>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    width: "100%",
                                    flexWrap: "wrap",
                                    fontSize: "14px",
                                }}
                                className="mb-1"
                            >
                                <div className="mr-1">Гарах огноо : </div>
                                <div style={{ fontWeight: "600" }}>
                                    {moment(item.endDate).format("YYYY-MM-DD")}
                                </div>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <RoomAssign
                                transactionInfo={{
                                    RoomTypeID: item.roomTypeID,
                                    TransactionID: item.transactionID,
                                    ArrivalDate: item.startDate,
                                    DepartureDate: item.endDate,
                                }}
                                additionalMutateUrl={additionalMutateUrl}
                                customRerender={customRerender}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {" "}
                            <Divider className="mt-3 mb-3" />
                        </Grid>
                    </Grid>
                ))}
        </>
    );
};

export default RoomAssignGroup;
