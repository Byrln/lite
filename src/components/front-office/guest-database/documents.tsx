import { GuestDocumentSWR } from "lib/api/guest-database";
import { useAppState } from "lib/context/app";
import { Button } from "@mui/material";
import { Icon } from "@iconify/react";
import cloudDownloadFill from "@iconify/icons-eva/cloud-download-fill";

const GuestHistory = () => {
    const [state]: any = useAppState();

    const { data, error } = GuestDocumentSWR(state.editId);

    return (
        data &&
        data.map((element: any, index: any) => (
            <Button
                key={index}
                href={element.DocumentFile}
                target="_blank"
                variant="outlined"
                startIcon={<Icon icon={cloudDownloadFill} />}
                className="mb-3"
            >
                {element.DocumentName}
            </Button>
        ))
    );
};

export default GuestHistory;
