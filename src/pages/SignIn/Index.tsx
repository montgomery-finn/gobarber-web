import React, { useRef, useCallback } from 'react';
import { Container, Content, Background, AnimationContainer } from './styles';
import logoImg from '../../assets/logo.svg';
import { FiLogIn } from 'react-icons/fi'
import Input from '../../components/Input/index';
import Button from '../../components/Button/index'; 
import { FiLock, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { Link, useHistory } from 'react-router-dom';

interface SignInFormData{
    email: string;
    password: string;
}

const SignIn: React.FC = () => {

    const formRef = useRef<FormHandles>(null);

    const { signIn } = useAuth();
    const { addToast } = useToast();
    const history = useHistory();

    const handleSubmit = useCallback(async (data: SignInFormData) => {
        try{
            formRef.current?.setErrors({});

            //lê-se: o schema recebe um objeto com o seguinte formato
            const schema = Yup.object().shape({
                email: Yup.string().required('Email obrigatório').email('Digite um email válido'),
                password: Yup.string().required('Senha obrigatória'),
            });

            await schema.validate(data, {
                abortEarly: false, //para validar todos os campos mesmo que um já tenha dado erro
            });

            await signIn({email: data.email, password: data.password});

            addToast({
                type: "success",
                description:"Login efetuado com sucesso",
                title: "Sucesso",
            });

            history.push('/dashboard');


        }
        catch(err){
            if(err instanceof Yup.ValidationError){
                formRef.current?.setErrors(getValidationErrors(err));
            }
            else{
                addToast({
                    title: 'Erro na autenticação',
                    type: 'error',
                    description: 'Ocorreu um erro ao fazer login. Confira os dados e tente novamente.',
                });
            }
        }

    }, [addToast, history, signIn]);

     return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />

                    <Form onSubmit={handleSubmit} ref={formRef}>
                        <h1>Faça o seu logon</h1>

                        <Input icon={FiMail} name="email" type="text" placeholder="E-mail"/>

                        <Input icon={FiLock} name="password" type="password" placeholder="Senha"/>

                        <Button type="submit">Entrar</Button>   

                        <Link to="forgot-password">Esqueci minha senha</Link> 
                    </Form>

                    <Link to="/signup">
                        <FiLogIn />
                        Criar conta
                    </Link>
                </AnimationContainer>
            </Content>

            <Background />

        </Container>
    );
}

export default SignIn;