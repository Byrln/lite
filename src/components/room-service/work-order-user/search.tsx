import { Grid } from "@mui/material";

import RoomTypeSelect from "components/select/room-type";
import ReferenceSelect from "components/select/reference";

const Search = ({ register, errors, control, reset }: any) => {
    return (
        <Grid container spacing={1}>
            <Grid item xs={3}>
                <ReferenceSelect
                    register={register}
                    errors={errors}
                    type="WorkOrderStatus"
                    label="Төлөв"
                    optionValue="WorkOrderStatusID"
                    optionLabel="Description"
                />
            </Grid>

            <Grid item xs={3}>
                <ReferenceSelect
                    register={register}
                    errors={errors}
                    type="WorkOrderPriority"
                    label="Зэрэглэл"
                    optionValue="WorkOrderPriorityID"
                    optionLabel="Description"
                />
            </Grid>

            <Grid item xs={3}>
                <RoomTypeSelect register={register} errors={errors} />
            </Grid>
        </Grid>
    );
};

export default Search;
