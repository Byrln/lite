import { format } from "date-fns";
import { useIntl } from "react-intl";

import CustomTable from "components/common/custom-table";
import { DepartedListSWR, GroupReservationSWR, ReservationAPI, listUrl } from "lib/api/reservation";
import NewEdit from "./new-edit";

const columns = [
  {
    title: "TransactionID",
    key: "TransactionID",
    dataIndex: "TransactionID",
  },
  {
    title: "CheckedInDate",
    key: "CheckedInDate",
    dataIndex: "CheckedInDate",
    render: function render(id: any, value: any) {
      return (value && format(
        new Date(value.replace(/ /g, "T")),
        "yyyy-MM-dd"
      ));
    },
  },
  {
    title: "CheckedOutDate",
    key: "CheckedOutDate",
    dataIndex: "CheckedOutDate",
    render: function render(id: any, value: any) {
      return (value && format(
        new Date(value.replace(/ /g, "T")),
        "MM/dd/yyyy hh:mm:ss a"
      ));
    },
  },
  {
    title: "Guest",
    key: "GuestName",
    dataIndex: "GuestName",
  },
  {
    title: "RoomNo",
    key: "RoomFullNo",
    dataIndex: "RoomFullNo  ",
  },
  {
    title: "Company",
    key: "CustomerName",
    dataIndex: "CustomerName",
  },
  {
    title: "Total",
    key: "TotalAmount",
    dataIndex: "TotalAmount",
  },
  {
    title: "Paid",
    key: "Deposit",
    dataIndex: "Deposit",
  },
  // {
  //   title: "Balance",
  //   key: "CurrentBalance",
  //   dataIndex: "CurrentBalance",
  // },
  {
    title: "User",
    key: "UserName",
    dataIndex: "UserName",
  },
];

const DeparturedListList = ({ title }: any) => {
  const intl = useIntl();

  const { data, error } = DepartedListSWR();

  return (
    <CustomTable
      columns={columns}
      data={data}
      error={error}
      api={ReservationAPI}
      hasNew={true}
      hasUpdate={true}
      //hasDelete={true}
      id="TransactionID"
      listUrl={listUrl}
      modalTitle={title}
      modalContent={<NewEdit />}
      excelName={title}
      additionalButtons={null}
      datagrid={true}
    />
  );
};

export default DeparturedListList;
