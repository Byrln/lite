import { useState, useEffect } from "react";
import { mutate } from "swr";
import { LoadingButton } from "@mui/lab";
import { Card, CardContent } from "@mui/material";
import { Icon } from "@iconify/react";
import searchFill from "@iconify/icons-eva/search-fill";
import trash2Fill from "@iconify/icons-eva/trash-2-fill";
import { useIntl } from "react-intl";

import Searchbar from "components/layouts/dashboard/search-bar";

const CustomSelect = ({
    children,
    listUrl,
    search,
    setSearch,
    handleSubmit,
    reset,
    searchInitialState = {},
    hideButtons = false,
}: any) => {
    const intl = useIntl();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (values: any) => {
        setLoading(true);
        console.log("Search values before setting:", values);
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
        <>
            <Searchbar>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    style={{ width: "100%" }}
                >
                    {/* <Card className="mb-3">
                        <CardContent> */}
                    {children}
                    {hideButtons == false && (
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
                                {intl.formatMessage({
                                    id: "ButtonSearchClear",
                                })}
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
                                {intl.formatMessage({
                                    id: "ButtonSearch",
                                })}
                            </LoadingButton>
                        </div>
                    )}

                    {/* </CardContent>
                    </Card> */}
                </form>
            </Searchbar>
        </>
    );
};

export default CustomSelect;
