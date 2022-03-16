import {Box} from "@mui/material";

const ItemDetail = ({ itemInfo }: any) => {

    console.log(itemInfo);

    return (
        <>
            <Box>
                Room block
                <p>{JSON.stringify(itemInfo)}</p>
            </Box>
        </>
    );
};
export default ItemDetail;

