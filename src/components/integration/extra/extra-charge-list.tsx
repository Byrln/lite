import CustomTable from "components/common/custom-table";
import { ExtraChargeListSWR } from "lib/api/extra-charge-list";
const columns = [
    { title: "№", key: "Nn", dataindex: "Nn" },
    { title: "Бараа/Үйлчилгээ", key: "", dataindex: "" },
    { title: "Материалын код", key: "", dataindex: "" },
    { title: "Байршил", key: "", dataindex: "" },
    { title: "Зарлагдсан дансны дугаар", key: "", dataindex: "" },
    { title: "Тооцооны дугаар", key: "", dataindex: "" },
    { title: "Бүлгийн нэр", key: "", dataindex: "" },
    { title: "Тоо хэмжээ ", key: "", dataindex: "" },
    { title: "Үйлчилгээ ", key: "", dataindex: "" },
    { title: "Нийлбэр дүн", key: "", dataindex: "" },
    { title: "Үйлчилгээ", key: "", dataindex: "" },
    { title: "Өдөр", key: "", dataindex: "" },
];
const ExtraChargeList = ({ title, search }: any) => {
    const { data, error } = ExtraChargeListSWR(search);
    return (
        <div>
            {title}
            <CustomTable id="Nn" data={data} error={error} columns={columns} />
        </div>
    );
};
export default ExtraChargeList;
