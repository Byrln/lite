import CustomSelect from "components/common/custom-select";

const languageOptions = [
    {
        value: "mn",
        label: "Монгол",
    },
    {
        value: "en",
        label: "English",
    },
];

const LanguageSelect = ({ register, errors }: any) => {
    return (
        <CustomSelect
            register={register}
            errors={errors}
            field="Language"
            label="Language"
            options={languageOptions}
            optionValue="value"
            optionLabel="label"
        />
    );
};

export default LanguageSelect;
