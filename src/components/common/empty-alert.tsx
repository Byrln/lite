import Alert from "@mui/material/Alert";

const EmptyAlert = (props: any) => (
    <Alert severity="warning">
        {props.message ? props.message : `Уучлаарай, жагсаалт хоосон байна.`}
    </Alert>
);

export default EmptyAlert;
