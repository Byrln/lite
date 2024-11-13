import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import mn from "date-fns/locale/mn";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { FolioItemEditSWR, FolioAPI } from "lib/api/folio";
import { FrontOfficeAPI } from "lib/api/front-office";
import { mutate } from "swr";
import { ReasonSWR } from "lib/api/reason";

export default function DeleteFolio({FolioID,
    CurrID,
    TypeID,
    handleModal,
    TransactionID,
}: any){

    useEffect(() => {
        fetchDatas();
    }, [FolioID, CurrID, TypeID]);


    const [newData, setNewData]=useState<any>()

    const [canVoid, setCanVoid]=useState<any>()


    const fetchDatas = async () => {
        let response = await FolioAPI.edits(FolioID, CurrID, TypeID);

        setCanVoid(response[0].CanVoid)

        setNewData(response);


    };

    const { data, error } = ReasonSWR({ ReasonTypeID: 2 });




    const [reasonID, setReasonID]=useState<any>("5")

    const handleReasonSelect=(event: SelectChangeEvent)=>{
        setReasonID(event.target.value as string);
    }

    const [workingDate, setWorkingDate] = useState(null);

    useEffect(() => {
        fetchDate();
    }, []);

    const fetchDate = async () => {
        let response = await FrontOfficeAPI.workingDate();
        if (response.status == 200) {
            setWorkingDate(response.workingDate[0].WorkingDate);
        }
    };


    const handleSubmit=async()=>{
        await FolioAPI?.VoidItem({
            FolioID:FolioID,
            TypeID:newData[0].TypeID,
            CurrID: newData[0].CurrID,
            ReasonID: reasonID
        })
        await mutate(`/api/Folio/Items`);
        handleModal();
    }

    return<div>
        <Stack direction='column' spacing={2}>
        <Stack direction='row' spacing={2} alignItems='center'>
        <Typography>
            Устгах шалтгаан сонгох
        </Typography>

        <Select value={reasonID} fullWidth onChange={handleReasonSelect}>
            {
                data?.map((element: any) => {
                    return (
                        <MenuItem
                            key={element.ReasonID}
                            value={element.ReasonID}
                        >
                            {element.ReasonName}
                        </MenuItem>
                    );
                })
            }
        </Select>
        </Stack>

        <Stack direction='row' spacing={2} alignItems='center' justifyContent='center'>

            <Button disabled={!canVoid} onClick={handleSubmit}>
                Устгах
            </Button>


        </Stack>

        </Stack>

    </div>
}
