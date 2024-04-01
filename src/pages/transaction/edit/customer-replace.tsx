import { useForm } from "react-hook-form";
import { Grid } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { mutate } from "swr";

import NewEditForm from "components/common/new-edit-form";
import { CustomerGroupAPI } from "lib/api/customer-group";
import { useAppState } from "lib/context/app";
import { ReservationAPI } from "lib/api/reservation";
import CustomerSelect from "components/select/customer";

const validationSchema = yup.object().shape({
    CustomerID: yup.string().required("Бөглөнө үү"),
});

const NewEdit = ({ TransactionID }: any) => {
    const [state]: any = useAppState();
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(validationSchema) });
    const [customerID, setCustomerID]: any = useState(null);

    const customSubmit = async (values: any) => {
        try {
            let tempValues = {
                TransactionID: TransactionID,
                CustomerID: customerID,
            };

            await ReservationAPI.customerReplace(tempValues);
        } finally {
            await mutate(`/api/FrontOffice/TransactionInfo`);
        }
    };

    return (
        <NewEditForm
            api={CustomerGroupAPI}
            listUrl={`/api/FrontOffice/TransactionInfo`}
            additionalValues={{
                CustomerGroupID: state.editId,
            }}
            reset={reset}
            handleSubmit={handleSubmit}
            customSubmit={customSubmit}
        >
            <Grid container spacing={1}>
                <Grid item xs={12} sm={12}>
                    <CustomerSelect
                        register={register}
                        errors={errors}
                        setEntity={setCustomerID}
                        isCustomSelect={true}
                    />
                </Grid>
            </Grid>
        </NewEditForm>
    );
};

export default NewEdit;
