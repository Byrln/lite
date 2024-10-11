import moment from "moment";
import { Stack } from "@mui/material";

import { PosApiInfoSWR } from "lib/api/pos-api";

const PosApiCheck = ({ HotelCode }: any) => {
    const { data, error } = PosApiInfoSWR(HotelCode);
    console.log("data", data);
    return (
        <>
            <Stack direction="row">
                <div className="mr-1">PosId : </div>
                {data && data.posId}
            </Stack>
            <br />
            <Stack direction="row">
                <div className="mr-1">Extra info </div>
            </Stack>
            <Stack direction="row">
                <div className="mr-1">Count Lottery : </div>
                {data && data.extraInfo && data.extraInfo.countLottery}
            </Stack>
            <Stack direction="row">
                <div className="mr-1">Last sent date : </div>
                {data &&
                    data.extraInfo &&
                    moment(data.extraInfo.lastSentDate).format(
                        "YYYY-MM-DD HH:mm:ss"
                    )}
            </Stack>
        </>
    );
};

export default PosApiCheck;
