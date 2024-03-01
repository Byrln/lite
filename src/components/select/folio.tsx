import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import CustomSelect from "components/common/custom-select";
import { FolioSWR } from "lib/api/folio";

const FolioSelect = ({
    register,
    errors,
    TransactionID,
    customField,
    groupID = null,
}: any) => {
    const { data, error } = FolioSWR(TransactionID, groupID);

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
            field={customField ? customField : "FolioID"}
            label="Тооцоо"
            options={data}
            optionValue="FolioID"
            optionLabel="FolioFullName"
        />
    );
};

export default FolioSelect;
