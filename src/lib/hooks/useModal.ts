import { useState } from "react";

const useModal = () => {
    const [visible, setVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState("");
    const [emptyModal, setEmptyModal] = useState(false);
    const [modalType, setModalType] = useState("medium");

    const handleModal = (
        visible: boolean = false,
        title: string = "",
        content: any = "",
        empty: boolean = false,
        modalKind: string = "medium",
    ) => {
        setVisible(visible);
        setModalTitle(title);
        setModalContent(content);
        setEmptyModal(empty);
        setModalType(modalKind);
    };

    return { visible, modalTitle, modalContent, emptyModal, modalType, handleModal };
};

export default useModal;
