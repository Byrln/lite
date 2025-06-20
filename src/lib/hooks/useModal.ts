import { useState } from "react";

const useModal = () => {
    const [visible, setVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState("");
    const [emptyModal, setEmptyModal] = useState(false);
    const [modalType, setModalType] = useState("medium");
    const [isWithSubmit, setIsWithSubmit] = useState(false);
    const [arrivalDate, setArrivalDate] = useState<string | undefined>(undefined);
    const [departureDate, setDepartureDate] = useState<string | undefined>(undefined);

    const handleModal = (
        visible: boolean = false,
        title: string = "",
        content: any = "",
        empty: boolean = false,
        modalKind: string = "medium",
        withSubmit: boolean = false,
        arrival?: string,
        departure?: string
    ) => {
        setVisible(visible);
        setModalTitle(title);
        setModalContent(content);
        setEmptyModal(empty);
        setModalType(modalKind);
        setIsWithSubmit(withSubmit);
        setArrivalDate(arrival);
        setDepartureDate(departure);
    };

    return {
        visible,
        modalTitle,
        modalContent,
        emptyModal,
        modalType,
        isWithSubmit,
        arrivalDate,
        departureDate,
        handleModal,
    };
};

export default useModal;
