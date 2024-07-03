import { TextField, Grid } from "@mui/material";
import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { useIntl } from "react-intl";
import RoomSelect from "components/select/room";
import ReferenceSelect from "components/select/reference";
import UserSelect from "components/select/user";

const Search = ({ register, errors, control, reset }: any) => {
    const intl = useIntl();
    return (
        <Grid container spacing={1}>
            <Grid item xs={3}>
                <RoomSelect
                    register={register}
                    errors={errors}
                    baseStay={{
                        TransactionID: 0,
                        roomType: "all",
                        dateStart: new Date(),
                        dateEnd: new Date(),
                        nights: 1,
                    }}
                />
            </Grid>

            <Grid item xs={3}>
                <ReferenceSelect
                    register={register}
                    errors={errors}
                    type="WorkOrderPriority"
                    id="RowHeaderPriority"
                    label={intl.formatMessage({id:"RowHeaderPriority"}) }
                    {...register("RowHeaderPriority")}
                    optionValue="WorkOrderPriorityID"
                    optionLabel="Description"
                />
            </Grid>

            <Grid item xs={3}>
                <UserSelect
                    register={register}
                    errors={errors}
                    IsHouseKeeper={true}
                    nameKey={"AssignedUserID"}
                />
            </Grid>

            <Grid item xs={3}>
                <ReferenceSelect
                    register={register}
                    errors={errors}
                    type="WorkOrderStatus"
                    id="Left_SortByStatus"
                    label={intl.formatMessage({id:"Left_SortByStatus"}) }
                    {...register("Left_SortByStatus")}
                    optionValue="WorkOrderStatusID"
                    optionLabel="Description"
                />
            </Grid>
        </Grid>
    );
};

export default Search;
