
import React, { useEffect } from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiXCircle} from 'react-icons/fi';
import { Container } from './style';
import { ToastMessage, useToast } from '../../../hooks/toast'

interface ToastProps {
    message: ToastMessage;
    style:  object;
}

const icons = {
    success: <FiCheckCircle size={20} />,
    error: <FiAlertCircle size={20} />,
    info: <FiInfo size={20} />,
}

const Toast: React.FC<ToastProps> = ({message, style}) => {
    
    const { removeToast } = useToast();

    useEffect(() => {   
        const timer = setTimeout(() => {
            removeToast(message.id);
        }, 3000);

        //se eu retornar uma função de dentro do useEffect, essa função será automaticamente 
        //executada quando o meu componente deixar de existir;

        return ()=>{
            clearTimeout(timer);
        }
    }, [message.id, removeToast]);

    return (
        <Container hasDescription={Number(!!message.description) /*não pode boolean dentro do HTML*/}
             type={message.type} style={style}>
            
            {icons[message.type || 'info']}

            <div>
                <strong>{message.title}</strong>
                {message.description && <p>{message.description}</p>} 
            </div>

            <button type='button' onClick={() => removeToast(message.id)}>
                <FiXCircle size={18}/>
            </button>
        </Container>
    );
}

export default Toast