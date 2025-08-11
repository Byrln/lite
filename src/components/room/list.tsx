import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";

import CustomSearch from "components/common/custom-search";
import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { RoomSWR, RoomAPI, listUrl } from "lib/api/room";
import NewEdit from "./new-edit";
import Search from "./search";

const RoomList = ({ title, setHasData = null }: any) => {
  const intl = useIntl();
  const validationSchema = yup.object().shape({
    SearchStr: yup.string().nullable(),
    RoomTypeID: yup.string().nullable(),
  });
  const columns = [
    {
      title: intl.formatMessage({ id: "RowHeaderRoomNo" }),
      key: "RoomNo",
      dataIndex: "RoomNo",
      sortable: true,
    },
    {
      title: intl.formatMessage({ id: "ConfigRoomType" }),
      key: "RoomTypeName",
      dataIndex: "RoomTypeName",
      sortable: true,
    },
    {
      title: intl.formatMessage({ id: "TextPhone" }),
      key: "TextPhone",
      dataIndex: "TextPhone",
    },
    {
      title: "Sort Order",
      key: "SortOrder",
      dataIndex: "SortOrder",
      sortable: true,
      width: 100,
    },
    {
      title: intl.formatMessage({ id: "RowHeaderStatus" }),
      key: "RowHeaderStatus",
      dataIndex: "RowHeaderStatus",
      excelRenderPass: true,
      renderCell: (element: any) => {
        return (
          <ToggleChecked
            id={element.id}
            checked={element.row.Status}
            api={RoomAPI}
            apiUrl="UpdateStatus"
            mutateUrl={`${listUrl}`}
          />
        );
      },
    },
    {
      title: intl.formatMessage({ id: "RowHeaderFloor" }),
      key: "FloorNo",
      dataIndex: "FloorNo",
      sortable: true,
    },
  ];
  const formOptions = { resolver: yupResolver(validationSchema) };
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm(formOptions);

  const [search, setSearch] = useState({});

  const { data: rawData, error } = RoomSWR(search);

  // Sort data by RoomType first, then by SortOrder, then by RoomNo
  const data = rawData ? [...rawData].sort((a: any, b: any) => {
    // First sort by RoomType to group rooms of same type together
    if (a.RoomTypeName !== b.RoomTypeName) {
      return a.RoomTypeName.localeCompare(b.RoomTypeName);
    }
    // Then sort by SortOrder within the same room type
    if (a.SortOrder !== undefined && b.SortOrder !== undefined) {
      if (a.SortOrder !== b.SortOrder) {
        return a.SortOrder - b.SortOrder;
      }
    }
    // Finally sort by RoomNo as tertiary sort
    return a.RoomNo.localeCompare(b.RoomNo, undefined, { numeric: true });
  }) : rawData;

  useEffect(() => {
    if (data && data.length > 0 && setHasData) {
      setHasData(true);
    }
  }, [data]);

  return (
    <>
      <CustomTable
        columns={columns}
        data={data}
        error={error}
        api={RoomAPI}
        hasNew={true}
                hasUpdate={true}
                hasDelete={true}
                hasMultipleDelete={true}
                hasAddFloors={true}
        id="RoomID"
        listUrl={listUrl}
        modalTitle={title}
        modalContent={<NewEdit />}
        modalsize="largest"
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
      />
    </>
  );
};

export default RoomList;
