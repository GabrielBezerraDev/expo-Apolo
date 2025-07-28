import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface ModalContextProps {
  setContentModal: Dispatch<SetStateAction<React.ReactNode>>;
  contentModal: React.ReactNode;
}

const ModalContext = createContext({} as ModalContextProps);

export default function ModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [contentModal, setContentModal] = useState<React.ReactNode>(
    {} as React.ReactNode
  );
  return (
    <ModalContext.Provider value={{ contentModal, setContentModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);
  return context;
};
