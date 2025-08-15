import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";

import CustomSearch from "components/common/custom-search";
import ToggleChecked from "components/common/custom-switch";
import DraggableDataGrid from "components/common/draggable-data-grid";
import { RoomSWR, RoomAPI, listUrl } from "lib/api/room";
import { mutate } from "swr";
import NewEdit from "./new-edit";
import Search from "./search";
import { Box, FormControlLabel, Switch } from "@mui/material";

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
  const [useDataGrid, setUseDataGrid] = useState(true);

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

      <DraggableDataGrid
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
        additionalButtons={
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={useDataGrid}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => setUseDataGrid(checked)}
                />
              }
              label="Use DataGrid Mode"
            />
          </Box>
        }
        modalsize="largest"
        excelName={title}
        datagrid={useDataGrid}
        enableDragDrop={!useDataGrid}
        excludeFromDragDrop={["TextPhone", "RowHeaderStatus"]}
        onRowReorder={(newData: any[], oldIndex: number, newIndex: number) => {
          console.log('Room reordered:', { newData, oldIndex, newIndex });

          // Group rooms by room type and update sort order within each group
          const roomsByType = newData.reduce((acc: any, room: any, index: number) => {
            if (!acc[room.RoomTypeName]) {
              acc[room.RoomTypeName] = [];
            }
            acc[room.RoomTypeName].push({ ...room, newIndex: index });
            return acc;
          }, {});

          // Update SortOrder for each room type group
          const updatedData: any[] = [];
          for (const roomType in roomsByType) {
            const roomsInType = roomsByType[roomType];
            // Sort by the new index (drag position) within each room type
            roomsInType.sort((a: any, b: any) => a.newIndex - b.newIndex);

            // Assign new SortOrder values within this room type
            roomsInType.forEach((room: any, index: number) => {
              updatedData.push({
                ...room,
                SortOrder: index + 1
              });
            });
          }

          // Sort the final data by room type, then by new sort order
          updatedData.sort((a: any, b: any) => {
            if (a.RoomTypeName !== b.RoomTypeName) {
              return a.RoomTypeName.localeCompare(b.RoomTypeName);
            }
            return a.SortOrder - b.SortOrder;
          });

          // Update room sort orders sequentially to avoid database deadlocks
          const updateRoomsSequentially = async () => {
            for (const room of updatedData) {
              try {
                await RoomAPI.update({
                  RoomID: room.RoomID,
                  RoomNo: room.RoomNo,
                  RoomTypeID: room.RoomTypeID,
                  FloorID: room.FloorID,
                  SortOrder: room.SortOrder,
                  RoomPhone: room.RoomPhone || '',
                  Description: room.Description || ''
                });
              } catch (error) {
                console.error('Failed to update room sort order:', error);
                break; // Stop on first error to prevent further issues
              }
            }
            // Refresh the data after all updates are complete
            mutate(listUrl);
          };

          updateRoomsSequentially();
        }}
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
