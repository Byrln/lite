import { useEffect, useState } from "react";

import { CashierSessionAPI } from "lib/api/cashier-session";
import CustomSelect from "components/common/custom-select";

const CashierSessionSelect = ({
    register,
    errors,
    label,
    StartYear = null,
    StartMonth = null,
    nameKey,
    onChange,
}: any) => {
    const [entity, setEntity] = useState(null);

    useEffect(() => {
        const fetchDatas = async () => {
            if (StartYear && StartMonth) {
                try {
                    const arr: any = await CashierSessionAPI?.list({
                        StartYear: StartYear,
                        StartMonth: StartMonth,
                    });
                    if (arr) {
                        setEntity(arr);
                    }
                } finally {
                }
            }
        };

        fetchDatas();
    }, [StartYear, StartMonth]);

    return (
        <>
            {entity && (
                <CustomSelect
                    register={register}
                    errors={errors}
                    field={nameKey ? nameKey : "SessionID"}
                    label={label}
                    options={entity}
                    optionValue="SessionID"
                    optionLabel="FullName"
                    onChange={onChange}
                />
            )}
        </>
    );
};

export default CashierSessionSelect;
