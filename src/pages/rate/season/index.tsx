import Typography from "@mui/material/Typography";
import SeasonList from "../../../components/rate/season/list";

const Index = (props: any) => {
    return (
        <>
            <Typography id="modal-modal-title" variant="h1" className="mb-3">
                Улирал
            </Typography>
            <SeasonList />
        </>
    );
};

export default Index;
