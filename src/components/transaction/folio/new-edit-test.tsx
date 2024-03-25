import { useState, useEffect } from "react";
import { FrontOfficeAPI } from "lib/api/front-office";
import { FolioItemSWR } from "lib/api/folio";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import mn from "date-fns/locale/mn";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const NewEditTest = ({ FolioID }: any) => {
    const [workingDate, setWorkingDate] = useState(null);
    const [entity, setEntity] = useState<any>({});
    const [rerenderKey, setRerenderKey] = useState(0);

    const { data, error } = FolioItemSWR(FolioID);

    useEffect(() => {
        if (data) {
            setEntity(data);
        }
    }, [data]);

    const onCheckboxChange = (e: any) => {
        let tempEntity = [...entity];
        tempEntity.forEach(
            (element: any) => (element.isChecked = e.target.checked)
        );
        setEntity(tempEntity);
        setRerenderKey((prevKey) => prevKey + 1);
    };

    useEffect(() => {
        fetchDatas();
    }, []);

    const fetchDatas = async () => {
        let response = await FrontOfficeAPI.workingDate();
        if (response.status == 200) {
            setWorkingDate(response.workingDate[0].WorkingDate);
        }
    };

    const TABS = [
        {
            value: "Тооцоо",
        },
        {
            value: "Төлбөр",
        },
    ];

    return (
        <div>
            <LocalizationProvider
                // @ts-ignore
                dateAdapter={AdapterDateFns}
                adapterLocale={mn}
            >
                <Grid container spacing={1}>
                    <Grid item xs={3}>
                        <TextField disabled fullWidth defaultValue="Hello" />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField disabled fullWidth defaultValue="Hello" />
                    </Grid>
                    <Grid item xs={3}></Grid>
                    <Grid item xs={3}></Grid>
                </Grid>
            </LocalizationProvider>
        </div>
    );
};

export default NewEditTest;
