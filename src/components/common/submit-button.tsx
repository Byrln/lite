import { LoadingButton } from "@mui/lab";

const SubmitButton = ({ loading, title, customMarginClass, id }: any) => (
    <LoadingButton
        fullWidth
        size="small"
        type="submit"
        variant="contained"
        loading={loading}
        className={customMarginClass ? customMarginClass : `mt-3`}
        id={id ? id : ""}
    >
        {title ? title : "Хадгалах"}
    </LoadingButton>
);

export default SubmitButton;
