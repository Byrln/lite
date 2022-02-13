import { useState, useContext } from "react";
import { mutate } from "swr";
import { toast } from "react-toastify";

import SubmitButton from "components/common/submit-button";
import { ModalContext } from "lib/context/modal";

const NewEditForm = ({
    children,
    api,
    entity,
    listUrl,
    additionalValues,
    handleSubmit,
}: any) => {
    const { handleModal }: any = useContext(ModalContext);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (values: any) => {
        setLoading(true);

        try {
            if (additionalValues) {
                values = Object.assign(values, additionalValues);
            }

            if (entity && entity._id) {
                await api?.update(entity._id, values);
            } else {
                await api?.new(values);
            }

            await mutate(listUrl);

            toast("Амжилттай.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            setLoading(false);
            handleModal();
        } catch (error) {
            setLoading(false);
            handleModal();
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {children}

            <SubmitButton loading={loading} />
        </form>
    );
};

export default NewEditForm;
