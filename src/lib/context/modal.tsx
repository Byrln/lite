import { createContext } from "react";

import useModal from "lib/hooks/useModal";
import CustomModal from "components/common/custom-modal";

const ModalContext = createContext(null);
const { Provider }: any = ModalContext;

const ModalProvider = ({ children }: any) => {
    const {
        visible,
        modalTitle,
        modalContent,
        emptyModal,
        modalType,
        arrivalDate,
        departureDate,
        handleModal,
    } = useModal();

    return (
        <Provider
            value={{
                visible,
                modalTitle,
                modalContent,
                emptyModal,
                modalType,
                arrivalDate,
                departureDate,
                handleModal,
            }}
        >
            <CustomModal ArrivalDate={arrivalDate} DepartureDate={departureDate} />
            {children}
        </Provider>
    );
};

export { ModalContext, ModalProvider };