import { Icon } from "@iconify/react";
import checkMark from "@iconify/icons-eva/checkmark-fill";
import closeMark from "@iconify/icons-eva/close-fill";

import { Stack } from "@mui/material";

import { PosApiCheckSWR } from "lib/api/pos-api";

const PosApiCheck = ({ HotelCode }: any) => {
    const { data, error } = PosApiCheckSWR(HotelCode);

    return (
        <>
            <Stack direction="row">
                <div className="mr-1">Тохиргоо : </div>
                {data && data.config && data.config.success == true ? (
                    <Icon icon={checkMark} color="green" height={24} />
                ) : (
                    <Icon icon={closeMark} color="red" height={24} />
                )}
            </Stack>
            <Stack direction="row">
                <div className="mr-1">Database : </div>
                {data && data.dataBase && data.dataBase.success == true ? (
                    <Icon icon={checkMark} color="green" height={24} />
                ) : (
                    <Icon icon={closeMark} color="red" height={24} />
                )}
            </Stack>
            <Stack direction="row">
                <div className="mr-1">Сүлжээ : </div>
                {data && data.network && data.network.success == true ? (
                    <Icon icon={checkMark} color="green" height={24} />
                ) : (
                    <Icon icon={closeMark} color="red" height={24} />
                )}
            </Stack>
            <Stack direction="row">
                <div className="mr-1">Амжилттай : </div>
                {data && data.success == true ? (
                    <Icon icon={checkMark} color="green" height={24} />
                ) : (
                    <Icon icon={closeMark} color="red" height={24} />
                )}
            </Stack>
        </>
    );
};

export default PosApiCheck;
