import Typography from "@mui/material/Typography";
import PaymentMethodList from "components/rate/payment-method/list";

const Index = (props: any) => {
    return (
        <>
            <Typography id="modal-modal-title" variant="h1" className="mb-3">
                Төлбөрийн хэлбэр
            </Typography>
            <PaymentMethodList />
        </>
    );
};

export default Index;
