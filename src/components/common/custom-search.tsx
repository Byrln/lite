import { useState, useEffect } from "react";
import { mutate } from "swr";
import { LoadingButton } from "@mui/lab";
import { Card, CardContent, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Icon } from "@iconify/react";
import searchFill from "@iconify/icons-eva/search-fill";
import trash2Fill from "@iconify/icons-eva/trash-2-fill";

import SubmitButton from "components/common/submit-button";

const CustomSelect = ({
    children,
    listUrl,
    search,
    setSearch,
    handleSubmit,
    reset,
}: any) => {
    const [loading, setLoading] = useState(false);

    const onSubmit = async (values: any) => {
        console.log("values", values);
        setLoading(true);

        setSearch(values);
        // (async () => {
        //     await mutate(`${listUrl}`);

        //     setLoading(false);
        // })();
        setLoading(false);
    };

    useEffect(() => {
        (async () => {
            setLoading(true);

            await mutate(`${listUrl}`);

            setLoading(false);
        })();
    }, [search]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="mb-3">
                <CardContent>
                    {children}

                    <div className="search-button-position">
                        <LoadingButton
                            variant="outlined"
                            size="small"
                            loading={loading}
                            className="mt-3 mr-3"
                            onClick={() => reset()}
                            startIcon={<Icon icon={trash2Fill} />}
                        >
                            Устгах
                        </LoadingButton>

                        <LoadingButton
                            size="small"
                            type="submit"
                            variant="contained"
                            loading={loading}
                            className="mt-3"
                            // onClick={onSubmit}
                            startIcon={<Icon icon={searchFill} />}
                        >
                            Хайх
                        </LoadingButton>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
};

export default CustomSelect;
