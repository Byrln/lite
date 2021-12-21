import Typography from "@mui/material/Typography";
import ExtraChargeGroupList from "components/rate/extra-charge-group/list";

const Index = (props: any) => {
    return (
        <>
            <Typography id="modal-modal-title" variant="h1" className="mb-3">
                Нэмэлт тооцооны бүлгүүд
            </Typography>
            <ExtraChargeGroupList />
        </>
    );
};

export default Index;
