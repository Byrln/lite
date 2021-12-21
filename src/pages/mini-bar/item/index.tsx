import Typography from "@mui/material/Typography";
import MiniBarItemList from "components/mini-bar/item/list";

const Index = (props: any) => {
    return (
        <>
            <Typography id="modal-modal-title" variant="h1" className="mb-3">
                Мини бар бүтээгдэхүүн
            </Typography>
            <MiniBarItemList />
        </>
    );
};

export default Index;
