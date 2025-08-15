import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import { Button } from "@mui/material";
import { Icon } from "@iconify/react";
import Link from "next/link";

import CustomSearch from "components/common/custom-search";
import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { RoomTypeSWR, RoomTypeAPI, listUrl } from "lib/api/room-type";
import NewEdit from "./new-edit";
import Search from "./search";

const RoomTypeList = ({ title, setHasData = null }: any) => {
  const intl = useIntl();
  const columns = [
    {
      title: intl.formatMessage({ id: "AmenityShortName" }),
      key: "RoomTypeShortName",
      dataIndex: "RoomTypeShortName",
    },
    {
      title: intl.formatMessage({ id: "Left_SortByRoomType" }),
      key: "RoomTypeName",
      dataIndex: "RoomTypeName",
    },
    {
      title: intl.formatMessage({ id: "ReportPax" }),
      key: "BaseAC",
      dataIndex: "BaseAC",
    },

    {
      title: intl.formatMessage({ id: "RowHeaderMaxAC" }),
      key: "MaxAC",
      dataIndex: "MaxAC",
    },
    {
      title: intl.formatMessage({ id: "Left_SortByStatus" }),
      key: "Status",
      dataIndex: "Status",
      excelRenderPass: true,
      renderCell: (element: any) => {
        return (
          <ToggleChecked
            id={element.id}
            checked={element.row.Status}
            api={RoomTypeAPI}
            apiUrl="UpdateStatus"
            mutateUrl={`${listUrl}`}
          />
        );
      },
    },
    {
      title: intl.formatMessage({ id: "RowHeaderAction" }),
      key: "Action",
      dataIndex: "Action",
      excelRenderPass: true,
      renderCell: (element: any) => {
        return (
          <>
            <Link
              key={element.id}
              href={`/room/type/picture/${element.row.RoomTypeID}`}
            >
              <Button key={element.id}>
                {intl.formatMessage({
                  id: "TextPicture",
                })}
              </Button>
            </Link>
          </>
        );
      },
    },
  ];
  const validationSchema = yup.object().shape({
    SearchStr: yup.string().nullable(),
    RoomChargeTypeGroupID: yup.string().nullable(),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm(formOptions);

  const [search, setSearch] = useState({});

  const { data, error } = RoomTypeSWR(search);

  useEffect(() => {
    if (data && data.length > 0 && setHasData) {
      setHasData(true);
    }
  }, [data]);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row-reverse" }}>
        <Link
          href="https://youtu.be/AvMN7J9Tp24?si=DuLdUN7HRzm_ktNW"
          passHref
          target="_blank"
          style={{
            paddingLeft: "6px",
            paddingRight: "6px",
            paddingTop: "3px",
          }}>

          <Icon
            icon="mdi:youtube"
            color="#FF0000"
            height={24}
          />

        </Link>
      </div>
      <CustomTable
        columns={columns}
        data={data}
        error={error}
        api={RoomTypeAPI}
        hasNew={true}
        hasUpdate={true}
        hasDelete={true}
        id="RoomTypeID"
        listUrl={listUrl}
        modalTitle={title}
        modalContent={<NewEdit />}
        excelName={title}
        search={
          <CustomSearch
            listUrl={listUrl}
            search={search}
            setSearch={setSearch}
            handleSubmit={handleSubmit}
            reset={reset}
          >
            <Search
              register={register}
              errors={errors}
              control={control}
              reset={reset}
            />
          </CustomSearch>
        }
        modalsize="medium"
      />
    </>
  );
};

export default RoomTypeList;
