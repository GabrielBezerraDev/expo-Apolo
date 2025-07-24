import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs 
} from "firebase/firestore";
import { IModelData } from "protocol/IModelData";
import { createContext, useContext, ReactNode } from "react";

// ==== TIPAGEM DO CONTEXTO ====
interface FirebaseContextProps {
  createPost: (novoPost: IModelData) => Promise<void>;
  getAll: () => Promise<IModelData[]>;
}

const FirebaseContext = createContext<FirebaseContextProps | undefined>(undefined);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const firebaseConfig = {
    apiKey: "AIzaSyAWBqygthUGaj71-yIfPrDCGYYNjpnMcZE",
    authDomain: "apolo-44879.firebaseapp.com",
    projectId: "apolo-44879",
    storageBucket: "apolo-44879.appspot.com",
    messagingSenderId: "480683612283",
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const modelDataCollectionRef = collection(db, "ModelData");

  const createPost = async (novoPost: IModelData) => {
    try {
      const docRef = await addDoc(modelDataCollectionRef, novoPost);
      console.log("Post criado com sucesso! ID do documento:", docRef.id);
    } catch (error) {
      console.error("Erro ao adicionar o documento: ", error);
    }
  };

  const getAll = async (): Promise<IModelData[]> => {
    try {
      const snapshot = await getDocs(modelDataCollectionRef);
      const data: IModelData[] = snapshot.docs.map(doc => ({
        ...(doc.data() as IModelData)
      }));
      return data;
    } catch (error) {
      console.error("Erro ao buscar documentos: ", error);
      return [];
    }
  };

  return (
    <FirebaseContext.Provider value={{ createPost, getAll }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase deve ser usado dentro de um FirebaseProvider");
  }
  return context;
}
