import React, { ButtonHTMLAttributes } from 'react';
import { Container } from './style'

//quando não for adicionar alguma propriedade à interface usar o type
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isLoading?: boolean;
};

const Button: React.FC<ButtonProps> = ({children, isLoading, ...rest}) => (
    <Container type='button' {...rest}>
        {isLoading ? 'Carregando' : children}
    </Container>
);

export default Button;