import Typography from "@mui/material/Typography";
import RateTypeList from "../../../components/rate/type/list";

const Index = (props: any) => {
    return (
        <>
            <Typography id="modal-modal-title" variant="h1" className="mb-3">
                Үнийн төрөл
            </Typography>
            <RateTypeList />
        </>
    );
};

export default Index;
