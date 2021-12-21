import Typography from "@mui/material/Typography";
import AmenityList from "components/room/amenity/list";

const Index = (props: any) => {
    return (
        <>
            <Typography id="modal-modal-title" variant="h1" className="mb-3">
                Өрөөний онцлог
            </Typography>
            <AmenityList />
        </>
    );
};

export default Index;
