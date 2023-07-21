    import {GetServerSideProps} from "next";
    import { useEffect} from "react";
    import {withAuthServerSideProps} from "lib/utils/with-auth-server-side-props";
    import {FrontOfficeAPI} from "lib/api/front-office";
    // Handsontable
    import 'handsontable/dist/handsontable.full.min.css';
    import dynamic from 'next/dynamic'
    import { registerAllModules } from 'handsontable/registry';
    // Radio
    import Radio from '@mui/material/Radio';
    import RadioGroup from '@mui/material/RadioGroup';
    import FormControlLabel from '@mui/material/FormControlLabel';
    import FormControl from '@mui/material/FormControl';
    import {useState} from "react";

    const data:any = [
        ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'J1', 'K1', 'L1', 'M1', 'N1', 'O1'],
    ];

    // @ts-ignore
    const HotTableCSR = dynamic(() => import('@handsontable/react').then(module => module.HotTable), {
        ssr: false,
    })
    function clickCell(event, coords){
        console.log(event)
        console.log(coords)
    }
    const TimelineList = ({props, workingDate}: any) => {
        const [dayCount, setDayCount] = useState("7");
        const [columns, setColumns] = useState([]);
        const [headers, setHeaders] = useState([]);
        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setDayCount((event.target as HTMLInputElement).value);
        };
        useEffect(() => {
            let cols:any = [];
            let titles:any = [];
            // First row
            titles.push("<br>Өрөө");
            cols.push({data: "room", readOnly: true, width: 120});
            let date_working = new Date(workingDate);
            let date_temp = new Date(workingDate);
            for (let i=0; i < parseInt(dayCount); i ++){
                if (i != 0) {
                    date_temp.setDate(date_temp.getDate() + 1);
                }
                cols.push({data: "day" + i.toString(), readOnly: true});
                let week = "";
                switch (date_temp.getDay()) {
                    case 0: week = "Ня"
                        break;
                    case 1: week = "Да";
                        break;
                    case 2: week = "Мя";
                        break;
                    case 3: week = "Лха";
                        break;
                    case 4: week = "Пү";
                        break;
                    case 5: week = "Ба";
                        break;
                    case 6: week = "Бя";
                        break;
                }
                titles.push(date_temp.getDate() + "<br>" + (date_temp.getMonth() + 1).toString() + " сар<br>" + week);
            }
            setColumns(cols)
            setHeaders(titles)
        },[dayCount])
        // @ts-ignore
        return (
            <>
                <h4>Календар</h4>
                <br/>
                <FormControl>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={dayCount}
                        onChange={handleChange}
                        defaultValue={"7"}
                    >
                        <FormControlLabel value="7" control={<Radio />} label="7 хоног" />
                        <FormControlLabel value="15" control={<Radio />} label="15 хоног" />
                        <FormControlLabel value="30" control={<Radio />} label="30 хоног" />
                    </RadioGroup>
                </FormControl>
                {/*{workingDate}*/}
                <HotTableCSR
                    data={data}
                    //rowHeaders={false}
                    //colHeaders={true}
                    width="100%"
                    height="auto"
                    licenseKey="non-commercial-and-evaluation" // for non-commercial use only
                    stretchH="all"
                    columns={columns}
                    //contextMenu={false}
                    colHeaders={headers}
                    cell={
                        [
                            {
                                row: 1,
                                col: 0,
                                className: 'custom-cell',
                                readOnly: true
                            },
                            {
                                row: 1,
                                col: 1,
                                className: 'half',
                            },

                        ]
                    }
                    afterOnCellMouseDown={(event, coords) => clickCell(event, coords)}
                />
            </>
        );
    };

    export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(
        async ({query: {id, curriculumMappingId}}) => {
            const workingDate = await FrontOfficeAPI.workingDate();
            return {
                props: {
                    workingDate: workingDate.workingDate[0].WorkingDate,
                },
            };
        }
    );

    export default TimelineList;
