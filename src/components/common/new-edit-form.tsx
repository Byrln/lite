/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { Box, CircularProgress, Grid } from "@mui/material";

import SubmitButton from "components/common/submit-button";
import { ModalContext } from "lib/context/modal";
import { useAppState } from "lib/context/app";
import { format } from "date-fns";

const NewEditForm = ({
    children,
    api,
    listUrl,
    additionalValues,
    reset,
    handleSubmit,
    setEntity,
    isShowNotAffected = false,
    handleModalNotAffected = false,
    stateEditIdNotAffected = false,
    dateKeys,
    customSubmitTitle,
    customResetEvent,
    customModificationBeforeSubmit,
    additionalButtons,
    customSubmit,
}: any) => {
    const [state]: any = useAppState();
    const { handleModal }: any = useContext(ModalContext);
    const [loadingData, setLoadingData] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDatas = async () => {
            if (state.editId) {
                setLoadingData(true);

                try {
                    const arr: any = await api?.get(state.editId);
                    if (dateKeys) {
                        if (Array.isArray(dateKeys)) {
                            for (const key of dateKeys) {
                                if (arr[0][key]) {
                                    arr[0][key] = format(
                                        new Date(
                                            arr[0][key].replace(/ /g, "T")
                                        ),
                                        "yyyy-MM-dd"
                                    );
                                }
                            }
                        } else {
                            if (arr[0][dateKeys]) {
                                arr[0][dateKeys] = format(
                                    new Date(
                                        arr[0][dateKeys].replace(/ /g, "T")
                                    ),
                                    "yyyy-MM-dd"
                                );
                            }
                        }
                    }

                    if (setEntity) {
                        setEntity(arr[0]);
                    }
                    if (customResetEvent) {
                        customResetEvent(arr);
                    } else {
                        reset(arr[0]);
                    }
                } finally {
                    setLoadingData(false);
                }
            }
        };

        fetchDatas();
    }, [state.editId]);

    const onSubmit = async (values: any) => {
        setLoading(true);
        try {
            if (additionalValues) {
                values = Object.assign(values, additionalValues);
            }

            if (customModificationBeforeSubmit) {
                customModificationBeforeSubmit(values);
            }

            if (!customSubmit) {
                if (state.editId && !stateEditIdNotAffected) {
                    await api?.update(values);
                } else {
                    await api?.new(values);
                }
            }

            if (customSubmit) {
                await customSubmit(values);
            }

            if (!handleModalNotAffected) {
                handleModal();
            }
            toast("Амжилттай.");
        } finally {
            // Only invalidate the specific list cache, not all user-related caches
            // This prevents sidebar data loss when closing modals
            if (listUrl) {
                await mutate(listUrl);
            }

            setLoading(false);
        }
    };

    return loadingData ? (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
        >
            <CircularProgress color="info" />
        </Grid>
    ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
            {children}

            {state.isShow && !isShowNotAffected ? null : (
                // <Box sx={{ width: "15%" }}>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        flexWrap: "wrap",
                        flexDirection: "row-reverse",
                    }}
                    className="mb-1"
                >
                    <SubmitButton
                        loading={loading}
                        title={customSubmitTitle}
                        fullWidth={false}
                    />
                    {additionalButtons}
                </Box>

                // </Box>
            )}
        </form>
    );
};

export default NewEditForm;
