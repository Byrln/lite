import { useState } from "react";

const useModal = () => {
    const [visible, setVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState("");
    const [emptyModal, setEmptyModal] = useState(false);

    const handleModal = (
        visible: boolean = false,
        title: string = "",
        content: any = "",
        empty: boolean = false,
    ) => {
        setVisible(visible);
        setModalTitle(title);
        setModalContent(content);
        setEmptyModal(empty);
    };

    return { visible, modalTitle, modalContent, emptyModal, handleModal };
};

export default useModal;
