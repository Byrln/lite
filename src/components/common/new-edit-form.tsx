/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { CircularProgress, Grid } from "@mui/material";

import SubmitButton from "components/common/submit-button";
import { ModalContext } from "lib/context/modal";
import { useAppState } from "lib/context/app";

const NewEditForm = ({
    children,
    api,
    listUrl,
    additionalValues,
    reset,
    handleSubmit,
    setEntity,
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
                    if (setEntity) {
                        setEntity(arr[0]);
                    }
                    reset(arr[0]);
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

            if (state.editId) {
                await api?.update(values);
            } else {
                await api?.new(values);
            }

            listUrl && (await mutate(listUrl));

            handleModal();
            toast("Амжилттай.");
        } finally {
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

            {state.isShow ? null : <SubmitButton loading={loading} />}
        </form>
    );
};

export default NewEditForm;
