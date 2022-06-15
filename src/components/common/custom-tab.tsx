import { Tabs, Tab, Typography } from "@mui/material";
import { useState } from "react";

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
            {value === index && <Typography>{children}</Typography>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

const CustomTab = ({ tabs }: any) => {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs"
                sx={{ pb: 2 }}
            >
                {tabs.map(({ label }: any, i: number) => (
                    <Tab label={label} key={i} {...a11yProps(i)} />
                ))}
            </Tabs>

            {tabs.map(({ component }: any, i: number) => (
                <TabPanel value={value} index={i} key={i}>
                    {component}
                </TabPanel>
            ))}
        </>
    );
};

export default CustomTab;
