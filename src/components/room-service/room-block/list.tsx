import moment from "moment";
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import {
  Checkbox,
  Button,
  Box,
  Grid
} from "@mui/material";
import { mutate } from "swr";
import { toast } from "react-toastify";

import CustomTable from "components/common/custom-table";
import { RoomBlockSWR, RoomBlockAPI, listUrl } from "lib/api/room-block";
import NewEdit from "./new-edit";

const RoomBlockList = ({ title, workingDate }: any) => {
  const [entity, setEntity] = useState<any>({});
  const intl = useIntl();
  const [rerenderKey, setRerenderKey] = useState(0);
  const [search, setSearch] = useState({
    StartDate: moment(workingDate).format("YYYY-MM-DD"),
    EndDate: moment(workingDate).add(15, "days").format("YYYY-MM-DD"),
  });
  const { data, error } = RoomBlockSWR(search);

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

  const columns = [
    {
      title: "№",
      key: "test",
      dataIndex: "test",
    },
    {
      title: intl.formatMessage({ id: "ReportCheck" }),
      key: "check",
      dataIndex: "check",
      withCheckBox: true,
      onChange: onCheckboxChange,
      render: function render(
        id: any,
        value: any,
        element: any,
        dataIndex: any
      ) {
        return (
          <Checkbox
            key={rerenderKey}
            checked={
              entity &&
              entity[dataIndex] &&
              entity[dataIndex].isChecked
            }
            onChange={(e: any) => {
              let tempEntity = [...entity];
              tempEntity[dataIndex].isChecked = e.target.checked;
              setEntity(tempEntity);
            }}
          />
        );
      },
    },
    {
      title: intl.formatMessage({ id: "MenuRooms" }),
      key: "RoomFullName",
      dataIndex: "RoomFullName",
    },
    {
      title: intl.formatMessage({ id: "RowHeaderBeginDate" }),
      key: "BeginDate",
      dataIndex: "BeginDate",
    },
    {
      title: intl.formatMessage({ id: "RowHeaderEndDate" }),
      key: "EndDate",
      dataIndex: "EndDate",
    },
    {
      title: intl.formatMessage({ id: "RowHeaderBlockedOn" }),
      key: "RowHeaderBlockedOn",
      dataIndex: "RowHeaderBlockedOn",
    },
    {
      title: intl.formatMessage({ id: "RowHeaderBlockedBy" }),
      key: "CreatedDate",
      dataIndex: "CreatedDate",
    },
    {
      title: intl.formatMessage({ id: "ConfigReasons" }),
      key: "UserName",
      dataIndex: "UserName",
    },
  ];

  return (
    <>
      {moment(workingDate).format("YYYY-MM-DD") +
        " - " +
        moment(workingDate).add(1, "days").format("YYYY-MM-DD")}

      <CustomTable
        columns={columns}
        data={data}
        error={error}
        api={RoomBlockAPI}
        hasNew={true}
        hasDateRangePicker={true}
        onDateRangeChange={({ startDate, endDate }: { startDate?: Date; endDate?: Date }) => {
          const formattedStartDate = startDate ? moment(startDate).format("YYYY-MM-DD") : "";
          const formattedEndDate = endDate ? moment(endDate).format("YYYY-MM-DD") : "";
          setSearch({ StartDate: formattedStartDate, EndDate: formattedEndDate });
        }}
        //hasUpdate={true}
        //hasDelete={true}
        id="RoomBlockID"
        listUrl={listUrl}
        modalTitle={title}
        modalContent={<NewEdit workingDate={workingDate} />}
        excelName={title}
        datagrid={false}
      />
    </>
  );
};

export default RoomBlockList;
