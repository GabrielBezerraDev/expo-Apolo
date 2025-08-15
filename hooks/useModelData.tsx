import { IModelData } from "protocol/interfaces/IModelData";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useFirebase } from "./useFirebase";
import { ECollections } from "protocol/Enum/ECollections";

interface ModelDataContextProps {
  modelsData: IModelData[];
}

const ModelDataContext = createContext({} as ModelDataContextProps);

export default function ModelDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [modelsData, setModelsData] = useState<IModelData[]>(
    [] as IModelData[]
  );
  const { getAll } = useFirebase();

  useEffect(() => {
    const fecthModelData = async () => {
      const result: IModelData[] = await getAll<IModelData>(ECollections["ModelData"]);
      setModelsData(result);
    };
    fecthModelData();
  }, []);

  return (
    <ModelDataContext.Provider value={{ modelsData }}>
      {children}
    </ModelDataContext.Provider>
  );
}

export const useModelData = () => {
  const context = useContext(ModelDataContext);
  return context;
};
