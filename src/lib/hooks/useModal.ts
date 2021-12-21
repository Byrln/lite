import { useState } from "react";

const useModal = () => {
    const [visible, setVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState("");

    const handleModal = (
        visible: boolean = false,
        title: string = "",
        content: any = ""
    ) => {
        setVisible(visible);
        setModalTitle(title);
        setModalContent(content);
    };

    return { visible, modalTitle, modalContent, handleModal };
};

export default useModal;
