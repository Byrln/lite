import { LoadingButton } from "@mui/lab";

const SubmitButton = ({ loading, title }: any) => (
    <LoadingButton
        fullWidth
        size="medium"
        type="submit"
        variant="contained"
        loading={loading}
        className="mt-3"
    >
        {title ? title : "Хадгалах"}
    </LoadingButton>
);

export default SubmitButton;
