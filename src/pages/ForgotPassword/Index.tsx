import React, { useRef, useCallback, useState } from 'react';
import { Container, Content, Background, AnimationContainer } from './styles';
import logoImg from '../../assets/logo.svg';
import { FiLogIn } from 'react-icons/fi'
import Input from '../../components/Input/index';
import Button from '../../components/Button/index'; 
import { FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';
import { Link } from 'react-router-dom';
import api from '../../services/api';

interface ForgotPasswordFormData{
    email: string;
}

const ForgotPassword: React.FC = () => {

    const formRef = useRef<FormHandles>(null);

    const { addToast } = useToast();

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = useCallback(async (data: ForgotPasswordFormData) => {
        try{
            formRef.current?.setErrors({});
            setIsLoading(true);

            //lê-se: o schema recebe um objeto com o seguinte formato
            const schema = Yup.object().shape({
                email: Yup.string().required('Email obrigatório').email('Digite um email válido')
            });

            await schema.validate(data, {
                abortEarly: false, //para validar todos os campos mesmo que um já tenha dado erro
            });

            await api.post('password/forgot', { email: data.email });

            addToast({
                type: "success",
                description:"Enviamos um e-mail para confirmar a recuperação de senha, cheque sua caixa de entrada",
                title: "E-mail de recuperação enviado",
            });
        }
        catch(err){
            if(err instanceof Yup.ValidationError){
                formRef.current?.setErrors(getValidationErrors(err));
            }
            else{
                addToast({
                    title: 'Erro na recuperação de senha',
                    type: 'error',
                    description: 'Ocorreu um erro ao tentar realizar a recuperação de senha, tente novamente.',
                });
            }
        }
        finally{
            setIsLoading(false);
        }

    }, [addToast]);

     return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />

                    <Form onSubmit={handleSubmit} ref={formRef}>
                        <h1>Recuperar senha</h1>

                        <Input icon={FiMail} name="email" type="text" placeholder="E-mail"/>

                        <Button type="submit" isLoading={isLoading}>Recuperar</Button>   

                    </Form>

                    <Link to="/signup">
                        <FiLogIn />
                        Voltar ao login
                    </Link>
                </AnimationContainer>
            </Content>

            <Background />

        </Container>
    );
}

export default ForgotPassword;