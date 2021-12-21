import Typography from "@mui/material/Typography";
import TaxList from "components/rate/tax/list";

const Index = (props: any) => {
    return (
        <>
            <Typography id="modal-modal-title" variant="h1" className="mb-3">
                Татвар
            </Typography>
            <TaxList />
        </>
    );
};

export default Index;
