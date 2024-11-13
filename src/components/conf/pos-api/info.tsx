import moment from "moment";
import { Stack } from "@mui/material";

import { PosApiInfoSWR } from "lib/api/pos-api";

const PosApiCheck = ({ HotelCode }: any) => {
    const { data, error } = PosApiInfoSWR(HotelCode);
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
                {data && data.leftLotteries}
            </Stack>
            <Stack direction="row">
                <div className="mr-1">Last sent date : </div>
                {data && data.lastSentDate}
            </Stack>
        </>
    );
};

export default PosApiCheck;
