import React, { useRef, useCallback } from 'react';
import { Container, Content, Background, AnimationContainer } from './styles';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input/index';
import Button from '../../components/Button/index'; 
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';
import {  useHistory, useLocation } from 'react-router-dom';
import api from '../../services/api';

interface ResetFormData{
    password: string;
    passwordConfirmation: string;
}

const ResetPassword: React.FC = () => {

    const formRef = useRef<FormHandles>(null);

    const location = useLocation();
    const { addToast } = useToast();
    const history = useHistory();

    const handleSubmit = useCallback(async (data: ResetFormData) => {
        try{

            formRef.current?.setErrors({});

            //lê-se: o schema recebe um objeto com o seguinte formato
            const schema = Yup.object().shape({
                password: Yup.string().required('Senha obrigatória'),
                passwordConfirmation: Yup.string().oneOf([Yup.ref('password'),
                 undefined], 'Confirmação incorreta'),
            });

            await schema.validate(data, {
                abortEarly: false, //para validar todos os campos mesmo que um já tenha dado erro
            });

            const token = location.search.replace('?token:', '').replace('?token=', '');

            if(!token){
                throw new Error();
            }

            console.log('esse é o token => ', token)

            await api.post('/password/reset', {
                password: data.password,
                passwordConfirmation: data.passwordConfirmation,
                token
            });

            addToast({
                type: "success",
                description:"Senha redefinida com sucesso",
                title: "Sucesso",
            });

            history.push('/');
        }
        catch(err){

            if(err instanceof Yup.ValidationError){
                formRef.current?.setErrors(getValidationErrors(err));
            }
            else{
                

                console.log('aqui esta o erro => ', err);
                addToast({
                    title: 'Erro na autenticação',
                    type: 'error',
                    description: 'Ocorreu um erro ao resetar sua senha, tente novamente.',
                });
            }
        }

    }, [addToast, history, location.search]);

     return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />

                    <Form onSubmit={handleSubmit} ref={formRef}>
                        <h1>Resetar senha</h1>

                        <Input icon={FiLock} name="password" type="password" placeholder="Nova senha"/>
                        <Input icon={FiLock} name="passwordConfirmation" type="password" placeholder="Confirmação da senha"/>

                        <Button type="submit">Alterar senha</Button>  
                    </Form>
                </AnimationContainer>
            </Content>

            <Background />

        </Container>
    );
}

export default ResetPassword;