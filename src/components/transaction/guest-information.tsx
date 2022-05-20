import Box from "@mui/material/Box";

const GuestInformation = ({ name, phone, email, address }: any) => {
    return (
        <Box sx={{ p: 1, border: "1px solid grey" }}>
            <Box sx={{ fontWeight: "bold" }}>{name}</Box>
            Mobile : {phone}
            <br />
            Email : {email}
            <br />
            Address : {address}
        </Box>
    );
};

export default GuestInformation;
