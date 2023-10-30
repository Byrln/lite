import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import CustomSelect from "components/common/custom-select";
import { ReferenceSWR } from "lib/api/reference";

const ReferenceSelect = ({
    register,
    errors,
    type,
    label,
    optionValue,
    optionLabel,
    customField,
    entity,
    setEntity,
}: any) => {
    const { data, error } = ReferenceSWR(type);

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
            field={customField ? customField : optionValue}
            label={label}
            options={data}
            optionValue={optionValue}
            optionLabel={optionLabel}
            entity={entity}
            onChange={(evt: any) => {
                setEntity &&
                    setEntity({
                        ...entity,
                        [customField]: Number(evt),
                    });
            }}
        />
    );
};

export default ReferenceSelect;
