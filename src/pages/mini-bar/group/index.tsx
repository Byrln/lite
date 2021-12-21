import Typography from "@mui/material/Typography";
import MiniBarGroupList from "components/mini-bar/group/list";

const Index = (props: any) => {
    return (
        <>
            <Typography id="modal-modal-title" variant="h1" className="mb-3">
                Мини бар групп
            </Typography>
            <MiniBarGroupList />
        </>
    );
};

export default Index;
