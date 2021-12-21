import Typography from "@mui/material/Typography";
import ExtraChargeList from "components/rate/extra-charge/list";

const Index = (props: any) => {
    return (
        <>
            <Typography id="modal-modal-title" variant="h1" className="mb-3">
                Нэмэлт тооцооны төрлүүд
            </Typography>
            <ExtraChargeList />
        </>
    );
};

export default Index;
