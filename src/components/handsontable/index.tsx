import { GetServerSideProps } from "next";
import { lazy, useEffect, useContext } from "react";
import { withAuthServerSideProps } from "lib/utils/with-auth-server-side-props";
import { FrontOfficeAPI, FrontOfficeSWR, listUrl } from "lib/api/front-office";
import * as yup from "yup";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { mutate } from "swr";
import { useIntl } from "react-intl";
// Handsontable
import "handsontable/dist/handsontable.full.min.css";
import dynamic from "next/dynamic";
import useSWR from "swr";
import Head from "next/head";
import { Box, Grid, Container } from "@mui/material";
import Page from "components/page";
import { dateStringToObj } from "lib/utils/helpers";

//test

// Radio
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { useState } from "react";
import { RoomTypeSWR } from "../../lib/api/room-type";
import { RoomSWR } from "../../lib/api/room";
import { RoomBlockSWR } from "../../lib/api/room-block";
import { StayView2SWR } from "../../lib/api/stay-view2";
import { dateToCustomFormat } from "../../lib/utils/format-time";
import { ModalContext } from "lib/context/modal";
import NewReservation from "components/reservation/new-edit";
import CustomSearch from "components/common/custom-search";
import Search from "./search";

const HotTableCSR = dynamic(
    // @ts-ignore
    () => {
        // @ts-ignore
        return import("handsontable/registry").then((module) => {
            module.registerAllModules();
            // @ts-ignore
            return import("@handsontable/react").then((submodule) => {
                return submodule;
            });
        });
    },
    {
        ssr: false,
    }
);

function getNumberOfDays(start: Date, end: Date, hour = 12) {
    // console.log(start, end)
    // One day in milliseconds
    let oneDay = 1000 * 60 * 60;
    if (hour !== null && hour !== undefined) {
        oneDay = oneDay * hour;
    }
    // Calculating the time difference between two dates
    const diffInTime = end.getTime() - start.getTime();
    // Calculating the no. of days between two dates
    const diffInDays = Math.round(diffInTime / oneDay);
    // console.log(diffInDays, hour)
    return diffInDays;
}

const myClick = () => {
    console.log("clicked ...");
};

const TimelineTable = ({ props, workingDate }: any) => {
    const intl = useIntl();
    const { handleModal }: any = useContext(ModalContext);
    const [dayCount, setDayCount] = useState("30");
    const [columns, setColumns] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [coldict, setColDict] = useState({});
    const [records, setRecords] = useState([]);
    const [cells, setCells] = useState([]);
    const [mergeCells, setMergeCells] = useState([]);
    const [orderCoords, setOrderCoords] = useState({});
    const [timeStart, setTimeStart] = useState(new Date(workingDate));
    const [timeEnd, setTimeEnd] = useState(
        new Date(
            new Date(workingDate).setDate(new Date(workingDate).getDate() + 7)
        )
    );

    const validationSchema = yup.object().shape({
        CurrDate: yup.string().nullable(),
        NumberOfDays: yup.string().nullable(),
        RoomTypeID: yup.string().nullable(),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };
    const {
        reset,
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm(formOptions);

    const [search, setSearch] = useState({
        CurrDate: workingDate,
        NumberOfDays: parseInt(dayCount),
        RoomTypeID: 0,
    });

    // let timeStart = new Date(workingDate);
    // let timeEnd = new Date(workingDate);
    // timeEnd.setDate(timeEnd.getDate() + 7);

    const { data: roomTypes, error: roomTypeSwrError } = RoomTypeSWR({
        RoomTypeID: search.RoomTypeID,
    });
    const { data: rooms, error: roomSwrError } = RoomSWR({});
    const {
        data: items,
        mutate: mutateItems,
        error: itemsError,
    } = FrontOfficeSWR({
        CurrDate: search.CurrDate ? search.CurrDate : workingDate,
        NumberOfDays: search.NumberOfDays,
        RoomTypeID: search.RoomTypeID,
    });
    const { data: availableRooms, error: availableRoomsError } = StayView2SWR(
        search.CurrDate ? search.CurrDate : workingDate,
        dayCount
    );
    const { data: roomBlocks, error: roomBlocksError } = RoomBlockSWR({
        //@ts-ignore
        StartDate: dateToCustomFormat(timeStart, "yyyy MMM dd"),
        EndDate: dateToCustomFormat(timeEnd, "yyyy MMM dd"),
    });

    const [excelData, setExcelData] = useState({
        records: [] as any,
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
        let value = (event.target as HTMLInputElement).value;
        setDayCount(value);
    };

    useEffect(() => {
        (async () => {
            setTimeStart(new Date(search.CurrDate));
            setTimeEnd(
                new Date(
                    new Date(search.CurrDate).setDate(
                        new Date(search.CurrDate).getDate() + 7
                    )
                )
            );

            await mutate("/api/RoomType/List");
            await mutate("/api/FrontOffice/StayView2");
        })();
    }, [search]);

    useEffect(() => {
        mutateItems();
        /* Excel column data build for UI start */
        let cols: any = [];
        let headers: any = [];
        let col_dict = {};
        // First row
        headers.push("<br>Өрөө");
        cols.push({ data: "room", readOnly: true, width: 100 });
        let date_working = new Date(
            search.CurrDate ? search.CurrDate : workingDate
        );
        let date_temp = new Date(
            search.CurrDate ? search.CurrDate : workingDate
        );
        for (let i = 0; i < parseInt(dayCount); i++) {
            if (i != 0) {
                date_temp.setDate(date_temp.getDate() + 1);
            }

            // @ts-ignore
            col_dict[date_temp.toISOString().slice(0, 10)] = i;
            let week = "";
            switch (date_temp.getDay()) {
                case 0:
                    week = "Ня";
                    break;
                case 1:
                    week = "Да";
                    break;
                case 2:
                    week = "Мя";
                    break;
                case 3:
                    week = "Лха";
                    break;
                case 4:
                    week = "Пү";
                    break;
                case 5:
                    week = "Ба";
                    break;
                case 6:
                    week = "Бя";
                    break;
            }
            headers.push({
                label:
                    date_temp.getDate() +
                    "<br>" +
                    (date_temp.getMonth() + 1).toString() +
                    " сар<br>" +
                    week,
                colspan: 2,
            });
        }
        for (let i = 0; i < parseInt(dayCount) * 2; i++) {
            cols.push({ data: i, readOnly: true, renderer: "html" });
        }
        // Column set
        setColumns(cols);
        // Colspan header set
        setHeaders(headers);
        /* Excel column data build for UI end */
        // Data prepare
        setColDict(col_dict);
        createRecords();
        if (items && items.length > 0) {
            console.log(items.length);
        }
    }, [dayCount, roomTypes, rooms, items, availableRooms, search]);

    function clickCell(event: any, coords: any) {
        let col = Math.round(coords.col / 2) - 1;
        if (col <= 0) {
            col = 0;
        }
        let key = Object.keys(coldict).filter(function (key) {
            // @ts-ignore
            return coldict[key] === col;
        })[0];

        if (
            // @ts-ignore
            records[coords.row].roomID > 0
        ) {
            handleModal(
                true,
                `New Reservation`,
                <NewReservation
                    dateStart={key}
                    // @ts-ignore
                    roomType={records[coords.row].roomTypeID}
                    // @ts-ignore
                    room={records[coords.row].roomID}
                />,
                null,
                "large"
            );
        }
    }

    // @ts-ignore
    const createRecords = () => {
        let records = [];
        let cells = [];
        let mergeCells = [];
        let group_index = [0];
        let order_coords = {};
        let i,
            j,
            k = 0;

        for (i in roomTypes) {
            let temp_rec = {
                id: "" + roomTypes[i].RoomTypeID,
                room: roomTypes[i].RoomTypeName,
                roomTypeID: roomTypes[i].RoomTypeID,
                roomID: 0,
                group: true,
            };
            // RoomType set 0
            for (let l = 0; l < parseInt(dayCount) * 2; l++) {
                // @ts-ignore
                temp_rec[l] = 0;
                for (let k in items) {
                    let startTime = new Date(items[k].StartDate); // startTime.setHours(14); startTime.setMinutes(0); startTime.setSeconds(0);
                    let endTime = new Date(items[k].EndDate);
                    let groupKey = "" + items[k].RoomTypeID;
                    if (items[k].RoomID == 0 && groupKey == temp_rec.id) {
                        // @ts-ignore
                        if (
                            // @ts-ignore
                            l > coldict[startTime.toISOString().slice(0, 10)] && // @ts-ignore
                            l < coldict[endTime.toISOString().slice(0, 10)] * 2
                        ) {
                            // @ts-ignore
                            temp_rec[l] = temp_rec[l] + 1;
                        }
                    }
                }
                // @ts-ignore
            }
            records.push(temp_rec);

            k++;
            for (j in rooms) {
                if (rooms[j].RoomTypeID == roomTypes[i].RoomTypeID) {
                    // @ts-ignore
                    temp_rec = {
                        id:
                            "" +
                            roomTypes[i].RoomTypeID +
                            "_" +
                            rooms[j].RoomID,
                        room: rooms[j].RoomNo,
                        roomID: rooms[j].RoomID,
                        roomTypeID: roomTypes[i].RoomTypeID,
                    };
                    for (let l = 0; l < parseInt(dayCount) * 2; l++) {
                        // @ts-ignore
                        temp_rec[l] = "";
                    }
                    records.push(temp_rec);
                    k++;
                }
            }
            group_index.push(k);
        }
        // Example set data
        // try {
        //     records[1][0] = 'John Wick';
        //     records[2][0] = 'John Snow';
        // }catch (e) {}
        // Example static data
        // cells.push(
        //     { row: 1, col: 1, className: 'green-cell' },
        //     { row: 2, col: 1, className: 'green-cell' },
        // )
        // Example merge cells
        // mergeCells = [
        //     { row: 1, col: 1, rowspan: 1, colspan: 3 },
        // ];
        for (i in items) {
            let startTime = new Date(items[i].StartDate); // startTime.setHours(14); startTime.setMinutes(0); startTime.setSeconds(0);
            let endTime = new Date(items[i].EndDate);
            let groupKey = "" + items[i].RoomTypeID;
            if (items[i].RoomID != 0) {
                groupKey = groupKey + "_" + items[i].RoomID;
            }
            for (let j in records) {
                // @ts-ignore
                if (groupKey == records[j]["id"]) {
                    // startTime, endTime calc style and merge cells calc
                    // @ts-ignore
                    let col_dict_temp =
                        // @ts-ignore
                        coldict[startTime.toISOString().slice(0, 10)];
                    let start_index = col_dict_temp;
                    // @ts-ignore
                    let end_index = coldict[endTime.toISOString().slice(0, 10)];
                    if (end_index === null || end_index === undefined) {
                        let last = Object.keys(coldict).pop();
                        // @ts-ignore
                        end_index = coldict[last];
                    }
                    let day_count = getNumberOfDays(startTime, endTime, 12);
                    let begin_start_index = start_index;
                    if (start_index !== null && start_index !== undefined) {
                        if (start_index > 1) {
                            start_index = start_index * 2 + 1;
                        }

                        // Set guest name for Excel cell
                        try {
                            // @ts-ignore
                            records[j][start_index] = items[i]["GuestName"];
                            // @ts-ignore
                            order_coords[j + "_" + start_index] = items[i];
                        } catch (e) {}

                        // Set merge cells
                        let mergeCell = {};
                        let cellStyle = {};

                        /* Set colspan rowspan for merge cells */
                        // @ts-ignore
                        mergeCell["row"] = parseInt(j);
                        // @ts-ignore
                        mergeCell["col"] = start_index + 1;
                        // @ts-ignore
                        mergeCell["rowspan"] = 1;
                        if (
                            begin_start_index == null ||
                            begin_start_index == undefined
                        ) {
                            // @ts-ignore
                            mergeCell["colspan"] =
                                day_count > 0 ? day_count - 1 : 1;
                        } else {
                            // @ts-ignore
                            mergeCell["colspan"] =
                                day_count > 0 ? day_count : 1;
                        }
                        // @ts-ignore
                        if (
                            items[i].RoomID !== 0 && // @ts-ignore
                            parseInt(mergeCell["colspan"]) != 1 && // @ts-ignore
                            parseInt(mergeCell["col"]) != -1 &&
                            parseInt(dayCount) * 2 - 1 > // @ts-ignore
                                parseInt(mergeCell["col"])
                        ) {
                            mergeCells.push(mergeCell);
                        }

                        /* Set cell styles */
                        // @ts-ignore
                        cellStyle["row"] = parseInt(j);
                        // @ts-ignore
                        cellStyle["col"] = start_index + 1;
                        // @ts-ignore
                        cellStyle["className"] =
                            "color-" + items[i]["StatusColor"].toUpperCase();
                        cells.push(cellStyle);
                    }
                }
            }
        }
        // Making bold for RoomType = 0
        for (i in group_index) {
            cells.push({
                row: group_index[i],
                col: 0,
                className: "black-bold-header",
            });
            // Making merge cells for excel
            for (let l = 0; l < parseInt(dayCount) + 1; l++) {
                let mergeCell = {};
                // @ts-ignore
                mergeCell["row"] = group_index[i];
                // @ts-ignore
                mergeCell["col"] = l * 2 - 1;
                // @ts-ignore
                mergeCell["rowspan"] = 1;
                // @ts-ignore
                mergeCell["colspan"] = 2;
                // @ts-ignore
                if (parseInt(mergeCell["col"]) != -1) {
                    mergeCells.push(mergeCell);
                }
            }
        }
        let temp_rec = { id: "last", room: "Боломжит өрөө" };

        // Bolomjit uruu
        if (availableRooms && availableRooms.length > 0) {
            for (let l = 0; l < parseInt(dayCount); l++) {
                // @ts-ignore
                temp_rec[l * 2] = availableRooms[0]["D" + (l + 1).toString()];
            }
        }
        // @ts-ignore
        records.push(temp_rec);
        // @ts-ignore
        setRecords(records);
        // @ts-ignore
        setCells(cells);
        // console.log(mergeCells)
        // @ts-ignore
        setMergeCells(mergeCells);
        // @ts-ignore
        setOrderCoords(order_coords);
    };

    // @ts-ignore
    return (
        <>
            <Head>
                <title>{intl.formatMessage({ id: "Calendar" })}</title>
            </Head>
            <Page>
                <Container maxWidth="xl">
                    <h4> {intl.formatMessage({ id: "Calendar" })}</h4>
                    <br />
                    <CustomSearch
                        listUrl={listUrl}
                        search={search}
                        setSearch={setSearch}
                        handleSubmit={handleSubmit}
                        reset={reset}
                        searchInitialState={{
                            CurrDate: workingDate,
                            NumberOfDays: parseInt(dayCount),
                            RoomTypeID: 0,
                        }}
                    >
                        <Search
                            register={register}
                            errors={errors}
                            control={control}
                            reset={reset}
                        />
                    </CustomSearch>
                    <FormControl>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={dayCount}
                            onChange={handleChange}
                            defaultValue={"30"}
                        >
                            <FormControlLabel
                                value="7"
                                control={<Radio />}
                                id="TextWeekly"
                                label={intl.formatMessage({ id: "TextWeekly" })}
                                {...register("TextWeekly")}
                            />
                            <FormControlLabel
                                value="15"
                                control={<Radio />}
                                id="TextWeekly"
                                label={intl.formatMessage({ id: "TextWeekly" })}
                                {...register("TextWeekly")}
                            />
                            <FormControlLabel
                                value="30"
                                control={<Radio />}
                                label="30 хоног"
                            />
                        </RadioGroup>
                    </FormControl>
                    {/*{workingDate}*/}
                    {/*{items}*/}
                    <HotTableCSR
                        // @ts-ignore
                        data={records}
                        //rowHeaders={false}
                        colHeaders={true}
                        rowHeaders={false}
                        fixedColumnsStart={1}
                        colWidths={30}
                        height="500px"
                        licenseKey="non-commercial-and-evaluation" // for non-commercial use only
                        // stretchH="all"
                        columns={columns}
                        // nestedHeaders={headers}
                        //contextMenu={false}
                        cell={cells}
                        mergeCells={mergeCells}
                        // afterOnCellMouseDown={(event: any, coords: any) =>
                        //     clickCell(event, coords)
                        // }
                        afterOnCellMouseDown={(
                            event: any,
                            coords: any,
                            td: any
                        ) => {
                            var now = new Date().getTime();
                            // check if dbl-clicked within 1/5th of a second. change 200 (milliseconds) to other value if you want
                            if (!(td.lastClick && now - td.lastClick < 200)) {
                                td.lastClick = now;
                                return; // no double-click detected
                            }

                            // double-click code goes here
                            clickCell(event, coords);
                        }}
                        nestedHeaders={[headers]}
                    />
                </Container>
            </Page>
        </>
    );
};

export default TimelineTable;
