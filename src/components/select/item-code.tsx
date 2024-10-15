import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useIntl } from "react-intl";
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { MenuItem, FormControl, Select, InputLabel } from "@mui/material";

import CustomSelect from "components/common/custom-select";
import { ItemCodeSWR, PosApiAPI } from "lib/api/pos-api";

const ItemCodeSelect = ({ value = 0, onChange, key2 }: any) => {
    const intl = useIntl();
    // const { data, error } = ItemCodeSWR({ EmptyRow: true });
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetchDatas();
    }, []);

    const fetchDatas = async () => {
        let response = await PosApiAPI.itemCode();
        if (response) {
            setData(response);
        }
    };

    return (
        <>
            <FormControl fullWidth>
                <InputLabel id="my-select-label">Сонгоно уу</InputLabel>
                <Select
                    labelId="my-select-label"
                    id="my-select"
                    value={value} // Controlled component with the current selected value
                    onChange={onChange} // onChange handler
                    key={key2} // Set a key if needed to force rerender
                    size="small"
                >
                    {data &&
                        data.map((option: any) => (
                            <MenuItem
                                key={option.POSApiServiceCode}
                                value={option.POSApiServiceCode}
                            >
                                {option.DescriptionFull}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
        </>
    );
};

export default ItemCodeSelect;
