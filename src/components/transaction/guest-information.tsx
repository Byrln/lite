import Box from "@mui/material/Box";

const GuestInformation = ({ name, phone, email, address }: any) => {
    return (
        <Box>
            <Box sx={{ fontWeight: "bold" }}>{name}</Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    flexWrap: "wrap",
                }}
                className="mb-1"
            >
                <div>Гар утас : </div>
                <div style={{ fontWeight: "600" }}>{phone}</div>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    flexWrap: "wrap",
                }}
                className="mb-1"
            >
                <div>Цахим шуудан : </div>
                <div style={{ fontWeight: "600" }}>{email}</div>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    flexWrap: "wrap",
                }}
            >
                <div>Address : </div>
                <div style={{ fontWeight: "600" }}>{address}</div>
            </Box>
        </Box>
    );
};

export default GuestInformation;
