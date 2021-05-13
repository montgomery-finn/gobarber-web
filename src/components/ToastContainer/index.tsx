import React from 'react';
import { Container } from './style';
import { ToastMessage, useToast } from '../../hooks/toast'
import Toast from './Toast/index';
import { useTransition } from 'react-spring';

interface ToastContainerProps {
    messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({messages}) =>{
    
    const messagesWithTransitions = useTransition(messages, (message) => message.id, {
        from: { right: '-120%', opacity: 0,},
        enter: { right: '0%', opacity: 1,},
        leave: { right: '-120%', opacity: 0,},
    })

    return (
        <Container>
            {messagesWithTransitions.map(({item, key, props}) => (
                <Toast key={key} message={item} style={props} /> 
            ))}         
        </Container>
    );
};

export default ToastContainer;