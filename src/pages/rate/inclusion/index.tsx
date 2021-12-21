import Typography from "@mui/material/Typography";
import InclusionList from "components/rate/inclusion/list";

const Index = (props: any) => {
    return (
        <>
            <Typography id="modal-modal-title" variant="h1" className="mb-3">
                Inclusion
            </Typography>
            <InclusionList />
        </>
    );
};

export default Index;
