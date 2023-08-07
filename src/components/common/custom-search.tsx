import { useState, useEffect } from "react";
import { mutate } from "swr";

import SubmitButton from "components/common/submit-button";

const CustomSelect = ({ children, listUrl, search, setSearch }: any) => {
    const [loading, setLoading] = useState(false);

    const onSubmit = async (values: any) => {
        console.log("values", values);
        setLoading(true);

        setSearch(values);

        setLoading(false);
    };

    useEffect(() => {
        if (search) {
            setLoading(true);

            (async () => {
                await mutate(`${listUrl}`);

                setLoading(false);
            })();
        }
    }, [search]);

    return (
        <form onSubmit={() => onSubmit}>
            {children}

            <SubmitButton loading={loading} />
        </form>
    );
};

export default CustomSelect;
