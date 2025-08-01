import { useState } from "react";
import { Box } from "@mui/material";

import { BeLink } from "lib/api/reservation-source";

const PackageList = ({ ChannelSourceID }: any) => {
    const [search, setSearch] = useState({
        ChannelSourceID: ChannelSourceID,
    });

    const { data, error } = BeLink(search);

    return (
        <>
            {data && data[0] && (
                <>
                    {data[0].Image && (
                        <Box>
                            <img
                                src={data[0].Image} //@ts-ignore
                            />
                        </Box>
                    )}
                    {data[0].Link && (
                        <a
                            href={data[0].Link} //@ts-ignore
                            target="_blank" //@ts-ignore
                            rel="noreferrer"
                        >
                            {data[0].Link}
                        </a>
                    )}
                </>
            )}
        </>
    );
};

export default PackageList;
