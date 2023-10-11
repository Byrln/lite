import { useState, useEffect } from "react";
import { mutate } from "swr";
import { LoadingButton } from "@mui/lab";
import { Card, CardContent } from "@mui/material";
import { Icon } from "@iconify/react";
import searchFill from "@iconify/icons-eva/search-fill";
import trash2Fill from "@iconify/icons-eva/trash-2-fill";

const CustomSelect = ({
    children,
    listUrl,
    search,
    setSearch,
    handleSubmit,
    reset,
    searchInitialState = {},
}: any) => {
    const [loading, setLoading] = useState(false);

    const onSubmit = async (values: any) => {
        setLoading(true);
        console.log("values", values);
        setSearch(values);

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
                            onClick={() => (
                                reset(), setSearch(searchInitialState)
                            )}
                            startIcon={<Icon icon={trash2Fill} />}
                        >
                            Хайлт цэвэрлэх
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
