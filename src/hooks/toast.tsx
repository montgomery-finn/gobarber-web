import React, { createContext, useCallback, useContext, useState } from 'react';
import ToastContainer from '../components/ToastContainer/index';
import { uuid } from 'uuidv4';

interface ToastContextData {
    addToast(toast: Omit<ToastMessage, 'id'>): void;
    removeToast(id: string): void;
}

export interface ToastMessage {
    id: string;
    title: string;
    description: string;
    type?: 'info' | 'success' | 'error';
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const ToastProvider: React.FC = ({children}) => {
    
    const[toasts, setToasts] = useState<ToastMessage[]>([]);

    const addToast = useCallback(({title, description, type}: Omit<ToastMessage, 'id'>)=>{
        const id = uuid();

        const toast = {
            id,
            title,
            description,
            type,
        }

        //a variável state aqui contém o dado anterior
        setToasts(state => [...state, toast]);

    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(state => state.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{addToast, removeToast}} >
            {children}
            <ToastContainer messages={toasts}/>
        </ToastContext.Provider>
    )
}

export function useToast(): ToastContextData {
    const context = useContext(ToastContext);

    if(!context){
        throw new Error('useToast must be within a ToastContextProvider');
    }

    return context;
}

