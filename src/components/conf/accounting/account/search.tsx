import { Grid } from "@mui/material";
import { useIntl } from "react-intl";

import CustomSelect from "components/common/custom-select";

const Search = ({ register, errors, control, reset }: any) => {
    const intl = useIntl();

    return (
        <Grid container spacing={1}>
            <Grid item xs={3}>
                <CustomSelect
                    register={register}
                    errors={errors}
                    field="IsDebit"
                    label={intl.formatMessage({ id: "TextAccountType" })}
                    options={[
                        {
                            key: 0,
                            value: intl.formatMessage({ id: "TextAll" }),
                        },
                        {
                            key: 1,
                            value: intl.formatMessage({ id: "TextDebit" }),
                        },
                        {
                            key: 2,
                            value: intl.formatMessage({ id: "TextCredit" }),
                        },
                    ]}
                    optionValue="key"
                    optionLabel="value"
                />
            </Grid>
        </Grid>
    );
};

export default Search;
