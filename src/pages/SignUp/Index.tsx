import React, { useCallback, useRef } from 'react';
import { Container, Content, Background, AnimationContainer } from './styles';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input/index';
import Button from '../../components/Button/index'; 
import { FiArrowLeft, FiUser, FiLock, FiMail, FiLogIn } from 'react-icons/fi';
import * as Yup from 'yup';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import getValidationErrors from '../../utils/getValidationErrors';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { useHistory } from 'react-router-dom';


//A forma convencional de trabalhar com formulários é utilizando um estado pra cada campo.
//Isso pode deixar a aplicação lenta pq cada vez que um estado muda o componente é refeito.
//Aqui será utilizado a biblioteca unform (feita pela Rocketseat) para trabalhar com os formulários.
//Para utilizá-la é necessário registrar cada input na biblioteca. (feito no componente Input)

const SignUp: React.FC = () => {

    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast();
    const history = useHistory();

    const handleSubmit = useCallback(async (data: object) => {
        try{
            formRef.current?.setErrors({});

            //lê-se: o schema recebe um objeto com o seguinte formato
            const schema = Yup.object().shape({
                name: Yup.string().required('Nome obrigatório'),
                email: Yup.string().required('Email obrigatório').email('Digite um email válido'),
                password: Yup.string().min(6, 'No mínimo 6 dígitos'),
            });

            await schema.validate(data, {
                abortEarly: false, //para validar todos os campos mesmo que um já tenha dado erro
            });

            api.post('/users', data);

            addToast({
                type: "success",
                title: 'Cadastro realizado!',
                description: 'Você já pode fazer login no GoBarber!',
            });

            history.push('/');
        }
        catch(err){
            if(err instanceof Yup.ValidationError){
                formRef.current?.setErrors(getValidationErrors(err));
            }
            else{
                addToast({
                    title: 'Erro no cadastro',
                    type: 'error',
                    description: 'Ocorreu um erro ao realizar cadastro. Tente novamente.',
                });
            }
        }
    }, [addToast, history]);


    return (
        <Container>
            <Background />
                <Content>
                    <AnimationContainer>
                        <img src={logoImg} alt="GoBarber" />
                        <Form onSubmit={handleSubmit} ref={formRef}>
                            <h1>Faça o seu cadastro</h1>

                            <Input icon={FiUser} name="name" type="text" placeholder="Nome"/>

                            <Input icon={FiMail} name="email" type="text" placeholder="E-mail"/>

                            <Input icon={FiLock} name="password" type="password" placeholder="Senha"/>

                            <Button type="submit">Cadastrar</Button>   

                        </Form>
                        <Link to="/">
                            <FiArrowLeft />
                            Voltar
                        </Link>
                    </AnimationContainer>
                </Content>
        </Container>
    );
}

export default SignUp;