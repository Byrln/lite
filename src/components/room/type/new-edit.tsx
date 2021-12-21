import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InputLabel from "@mui/material/InputLabel";
import Checkbox from "@mui/material/Checkbox";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useState } from "react";

import NewEditForm from "components/common/new-edit-form";
import RoomAmenitySelect from "components/select/room-amenity";
import AmenitySelect from "components/select/amenity";

import { RoomTypeAPI, listUrl } from "lib/api/room-type";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

const NewEdit = ({ entity }: any) => {
    const [value, setValue] = useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const validationSchema = yup.object().shape({
        RoomTypeShortName: yup.string().required("Бөглөнө үү"),
        RoomTypeName: yup.string().required("Бөглөнө үү"),
        BaseAdult: yup.number().required("Бөглөнө үү"),
        BaseChild: yup.number().required("Бөглөнө үү"),
        MaxAdult: yup.number().required("Бөглөнө үү"),
        MaxChild: yup.number().required("Бөглөнө үү"),
        SortOrder: yup.number(),
        BookingDescription: yup.string(),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm(formOptions);

    return (
        <NewEditForm
            api={RoomTypeAPI}
            entity={entity}
            listUrl={listUrl}
            handleSubmit={handleSubmit}
        >
            <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                    >
                        <Tab label="General" {...a11yProps(0)} />
                        <Tab label="Booking Engine" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <TextField
                        fullWidth
                        id="RoomTypeShortName"
                        label="Товч нэр"
                        {...register("RoomTypeShortName")}
                        margin="dense"
                        error={errors.RoomTypeShortName?.message}
                        helperText={errors.RoRoomTypeShortNameomNo?.message}
                    />

                    <TextField
                        fullWidth
                        id="RoomTypeName"
                        label="Нэр"
                        {...register("RoomTypeName")}
                        margin="dense"
                        error={errors.RoomTypeName?.message}
                        helperText={errors.RoomTypeName?.message}
                    />
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                type="number"
                                fullWidth
                                id="BaseAdult"
                                label="Том хүн - үндсэн"
                                {...register("BaseAdult")}
                                margin="dense"
                                error={errors.BaseAdult?.message}
                                helperText={errors.BaseAdult?.message}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                type="number"
                                fullWidth
                                id="BaseChild"
                                label="Хүүхэд - үндсэн"
                                {...register("BaseChild")}
                                margin="dense"
                                error={errors.BaseChild?.message}
                                helperText={errors.BaseChild?.message}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                type="number"
                                fullWidth
                                id="MaxAdult"
                                label="Том хүний тоо - дээд хязгаар"
                                {...register("MaxAdult")}
                                margin="dense"
                                error={errors.MaxAdult?.message}
                                helperText={errors.MaxAdult?.message}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                type="number"
                                fullWidth
                                id="MaxChild"
                                label="Хүүхдийн тоо - дээд хязгаар"
                                {...register("MaxChild")}
                                margin="dense"
                                error={errors.MaxChild?.message}
                                helperText={errors.MaxChild?.message}
                            />
                        </Grid>
                    </Grid>

                    <RoomAmenitySelect register={register} errors={errors} />
                </TabPanel>

                <TabPanel value={value} index={1}>
                    <TextField
                        type="number"
                        fullWidth
                        id="SortOrder"
                        label="Эрэмбэлэх утга"
                        {...register("SortOrder")}
                        margin="dense"
                        error={errors.SortOrder?.message}
                        helperText={errors.SortOrder?.message}
                    />

                    <TextField
                        fullWidth
                        id="BookingDescription"
                        label="Товч тайлбар (Онлайн захиалга)"
                        {...register("BookingDescription")}
                        margin="dense"
                        error={errors.BookingDescription?.message}
                        helperText={errors.BookingDescription?.message}
                    />

                    <InputLabel htmlFor="my-input" className="mt-3">
                        Онлайн захиалга дээр харуулах эсэх
                    </InputLabel>
                    <Checkbox {...register("Booking")} />

                    <AmenitySelect register={register} errors={errors} />
                </TabPanel>
            </Box>
        </NewEditForm>
    );
};

export default NewEdit;
