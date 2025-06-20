import { Box } from "@mui/material";

export default function Logo({ size, sx }: any) {
    return (
        <Box
            component="img"
            src="/images/logo.png"
            sx={{
                width: size ? 40 : "80%",
                height: size ? 40 : "auto",
                objectFit: "contain",
                ...sx,
            }}
        />
    );
}
