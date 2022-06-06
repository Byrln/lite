import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import CustomSelect from "components/common/custom-select";
import { ChargeTypeGroupSWR } from "lib/api/charge-type-group";

const ChargeTypeGroupSelect = ({ register, errors, listType }: any) => {
    const { data, error } = ChargeTypeGroupSWR(listType);

    if (error) return <Alert severity="error">{error.message}</Alert>;

    if (!error && !data)
        return (
            <Box sx={{ width: "100%" }}>
                <Skeleton />
                <Skeleton animation="wave" />
            </Box>
        );

    return (
        <CustomSelect
            register={register}
            errors={errors}
            field="RoomChargeTypeGroupID"
            label="Нэмэлт тооцооны бүлгүүд"
            options={data}
            optionValue="RoomChargeTypeGroupID"
            optionLabel="RoomChargeTypeGroupName"
        />
    );
};

export default ChargeTypeGroupSelect;
