import { format } from "date-fns";

import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import {
  NewRevervationSWR,
  NewRevervationAPI,
  listUrl,
} from "lib/api/new-revervation";
import NewEdit from "components/front-office/reservation-list/new";

const columns = [
  {
    title: "Company",
    key: "Company",
    dataIndex: "Company",
  },
  {
    title: "Name",
    key: "Name",
    dataIndex: "Name",
  },
  {
    title: "Phone",
    key: "Phone",
    dataIndex: "Phone",
  },
  {
    title: "Email",
    key: "Email",
    dataIndex: "Email",
  },
];

const NewRevervationList = ({ title }: any) => {
  const { data, error } = NewRevervationSWR();
  return (
    <CustomTable
      columns={columns}
      data={data}
      error={error}
      api={NewRevervationAPI}
      hasNew={true}
      hasUpdate={true}
      hasDelete={true}
      id="NewRevervationID"
      listUrl={listUrl}
      modalTitle={title}
      modalContent={<NewEdit />}
      excelName={title}
    />
  );
};

export default NewRevervationList;
