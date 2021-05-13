import React from 'react';
import { Container } from './style';

interface TooltipProps{
    title: string;
    className?: string; //essa propriedade serve para permitir que esse componente seja importado e 
                       //estilizado pelo styled-components novamente
}

const Tooltip: React.FC<TooltipProps> = ({title, className = '', children}) => {
    return <Container className={className}>
        <span>{title}</span>
        {children}
    </Container>
};

export default Tooltip;