import { LoadingButton } from "@mui/lab";

const SubmitButton = ({ loading }: any) => (
    <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={loading}
        className="mt-3"
    >
        Хадгалах
    </LoadingButton>
);

export default SubmitButton;
