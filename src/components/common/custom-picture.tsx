import Tooltip from "@mui/material/Tooltip";

const CustomPicture = ({ src, name }: any) => {
    return (
        <Tooltip
            title={
                <img
                    src={src}
                    style={{ maxWidth: "70vw", maxHeight: "70vh" }}
                    alt={name}
                />
            }
        >
            <img //@ts-ignore
                src={src}
                alt={name}
                style={{
                    height: "70px",
                    objectFit: "cover",
                }}
            />
        </Tooltip>
    );
};

export default CustomPicture;
