import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";

// ==== TIPAGEM DO CONTEXTO ====
interface FirebaseContextProps {
  createPost: <T>(newPost: Partial<T>, collectionName: string) => Promise<void>;
  getAll: <T>(collectionName: string) => Promise<T[]>;
}

const FirebaseContext = createContext<FirebaseContextProps | undefined>(
  undefined
);

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

  const currentDate = () =>
    new Date().toLocaleDateString("pt-br", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const createPost = async <T,>(newPost: Partial<T>, collectionName: string) => {
    const targetCollection = collectionName;
    
    if (!targetCollection.trim()) {
      console.error("Erro: Collection não foi definida");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, targetCollection), {
        ...newPost,
        metaData: { created_at: currentDate(), updated_at: currentDate() },
      });
      console.log("Post criado com sucesso! ID do documento:", docRef.id);
    } catch (error) {
      console.error("Erro ao adicionar o documento: ", error);
    }
  };

  const getAll = useCallback(async <T,>(collectionName: string): Promise<T[]> => {
    const targetCollection = collectionName;
    
    if (!targetCollection.trim()) {
      console.error("Erro: Collection não foi definida");
      return [];
    }

    try {
      const snapshot = await getDocs(collection(db, targetCollection));
      const data: T[] = snapshot.docs.map((doc) => ({
        ...(doc.data() as T),
        id: doc.id, // Inclui o ID do documento
      }));
      console.log(`Dados obtidos da collection '${targetCollection}':`, data);
      return data;
    } catch (error) {
      console.error("Erro ao buscar documentos: ", error);
      return [];
    }
  }, [db]);

  return (
    <FirebaseContext.Provider
      value={{ createPost, getAll }}
    >
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