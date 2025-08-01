import CustomSelect from "components/common/custom-select";

const languageOptions = [
    {
        value: "MN",
        label: "Монгол",
    },
    {
        value: "EN",
        label: "English",
    },
];

const LanguageSelect = ({ register, errors }: any) => {
    return (
        <CustomSelect
            register={register}
            errors={errors}
            field="Language"
            label="Хэл"
            options={languageOptions}
            optionValue="value"
            optionLabel="label"
        />
    );
};

export default LanguageSelect;
