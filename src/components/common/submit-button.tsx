import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";

const SubmitButton = ({
    loading,
    title,
    customMarginClass,
    id,
    fullWidth = true,
}: any) => (
    <LoadingButton
        fullWidth={fullWidth}
        size="small"
        type="submit"
        variant="contained"
        loading={loading}
        className={`${
            customMarginClass ? customMarginClass : `mt-3`
        } pl-2 pr-2`}
        id={id ? id : ""}
    >
        <SaveIcon className="mr-1" />
        {title ? title : "Хадгалах"}
    </LoadingButton>
);

export default SubmitButton;
