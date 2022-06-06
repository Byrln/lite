import { useState, useEffect } from "react";
import { mutate } from "swr";
import { Switch } from "@mui/material";
import { LoadingButton } from "@mui/lab";

const ToggleChecked = ({
    id,
    checked,
    disabled = false,
    api,
    apiUrl,
    mutateUrl,
}: any) => {
    const [isChecked, setIsChecked] = useState(checked);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setIsChecked(checked);
    }, [checked]);

    const onToggleChecked = async () => {
        setLoading(true);

        try {
            await api.toggleChecked(id, !checked, apiUrl);
            mutateUrl && (await mutate(mutateUrl));

            setIsChecked(!isChecked);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LoadingButton loading={loading}>
            <Switch
                checked={isChecked}
                disabled={loading || disabled}
                onClick={onToggleChecked}
            />
        </LoadingButton>
    );
};

export default ToggleChecked;
