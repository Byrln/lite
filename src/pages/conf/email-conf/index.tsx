import Typography from "@mui/material/Typography";
import EmailList from "components/conf/email-conf/list";

const Index = (props: any) => {
    return (
        <>
            <Typography id="modal-modal-title" variant="h1" className="mb-3">
                И-мэйл тохиргоо
            </Typography>
            <EmailList />
        </>
    );
};

export default Index;
