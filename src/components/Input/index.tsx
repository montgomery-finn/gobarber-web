
import React, { InputHTMLAttributes, ComponentType, useRef, useEffect, useState, useCallback } from 'react';
import { Container, Error } from './style';
import { IconBaseProps } from 'react-icons';
import {useField} from '@unform/core';
import { FiAlertCircle } from 'react-icons/fi';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string; //aqui estamos fazendo override na propriedade name e tornando-a obrigatória
    icon: ComponentType<IconBaseProps>;
    containerStyle?: object;
}

//aqui precisa renomear o icon para Icon, pq senão na hora de usar, o React não entene que é um componente
const Input: React.FC<InputProps> = ({name, icon: Icon, containerStyle, ...rest}) => {
    
    //A forma convencional de trabalhar com formulários é utilizando um estado pra cada campo.
    //Isso pode deixar a aplicação lenta pq cada vez que um estado muda o componente é refeito.
    //Aqui será utilizado a biblioteca unform (feita pela Rocketseat) para trabalhar com os formulários.
    //Para utilizá-la é necessário registrar cada input na biblioteca. (código abaixo)

    const inputRef = useRef<HTMLInputElement>(null); //uma referência para o elemento, como document.getElement
    const { fieldName, defaultValue, error, registerField } = useField(name)

    //para executar quando o componente aparecer na tela
    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRef.current, //no .current é onde fica o elemento
            path: 'value' //a partir do ref, o caminho para se obter os dados contidos no elemento
        });
    }, [ fieldName, registerField]);

    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    //No Javascript quando uma função é declarada dentro de outra função, ela é recriada na memória sempre
    //que a primeira for chamada. Para evitar esse comportamento, e criar a função na memória somente uma vez
    //(ou somente quando quisermos) utilizamos o useCallback

    const handleOnBlur = useCallback(() => {
        setIsFocused(false);
        setIsFilled(!!inputRef.current?.value);
    }, []); //no array passar as variáveis que quando alteradas, recriar a função na memória
    
    const handleOnFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    return (
        <Container style={containerStyle} isErrored={!!error} isFocused={isFocused} isFilled={isFilled}>
            {Icon && <Icon />}

            <input {...rest} name={name} defaultValue={defaultValue} ref={inputRef} 
                onFocus={handleOnFocus} onBlur={handleOnBlur}/>

            {error && (
                <Error title={error}>
                    <FiAlertCircle />
                </Error> 
            )}
        </Container>
    );
}

export default Input;