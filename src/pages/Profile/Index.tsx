import React, { useCallback, useRef, ChangeEvent } from 'react';
import { Container, Content, AvatarInput } from './styles';
import Input from '../../components/Input/index';
import Button from '../../components/Button/index'; 
import { FiUser, FiLock, FiMail, FiCamera, FiArrowLeft } from 'react-icons/fi';
import * as Yup from 'yup';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
    name: string;
    email: string;
    oldPassword: string;
    password: string;
    passwordConfirmation: string;
}

const Profile: React.FC = () => {

    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast();
    const history = useHistory();
    
    const { user, updateUser } = useAuth();

    const handleSubmit = useCallback(async (data: ProfileFormData) => {
        try{
            formRef.current?.setErrors({});

            //lê-se: o schema recebe um objeto com o seguinte formato
            const schema = Yup.object().shape({
                name: Yup.string().required('Nome obrigatório'),
                email: Yup.string().required('Email obrigatório').email('Digite um email válido'),
                oldPassword: Yup.string(),
                password: Yup.string().when('oldPassword', {
                    is: val => !!val.length,
                    then: Yup.string().required('Campo obrigatório'),
                    otherwise: Yup.string(),
                }),
                passwordConfirmation: Yup.string()
                    .when('oldPassword', {
                        is: val => !!val.length,
                        then: Yup.string().required('Campo obrigatório'),
                        otherwise: Yup.string(),
                    })
                    .oneOf([Yup.ref('password'), undefined], 'Confirmação incorreta'),
            });

            await schema.validate(data, {
                abortEarly: false, //para validar todos os campos mesmo que um já tenha dado erro
            });

            const {
                name,
                email,
                oldPassword,
                password,
                passwordConfirmation,
            } = data;

            const formaData = {
                name,
                email,
                ...(oldPassword
                    ? {
                        oldPassword,
                        password,
                        passwordConfirmation,
                      }
                    : {}),
            };


            const response = await api.put('/profile', formaData);

            updateUser(response.data.user);

            history.push('/dashboard');

            addToast({
                type: "success",
                title: 'Perfil atualizado!',
                description: 'Suas informações de perfil foram atualizadas com sucesso!',
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
                    description: 'Ocorreu um erro ao atualizar informações. Tente novamente.',
                });
            }
        }
    }, [addToast, history, updateUser]);

    const handleAvatarChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if(e.target.files){
                const data = new FormData();

                data.append('avatar', e.target.files[0]);
    
                api.patch('/users/avatar', data).then((response) => {
                    updateUser(response.data.user);

                    addToast({
                        type: 'success', 
                        title: 'Sucesso', 
                        description: 'Avatar atualizado!'
                    });
                })
            }
        },
        [addToast, updateUser]
    );
    
    return (
        <Container>

            <header>
                <div>
                    <Link to="/dashboard">
                        <FiArrowLeft />
                    </Link>
                </div>
            </header>
            
            <Content>

                <Form onSubmit={handleSubmit} ref={formRef} initialData={{name: user.name, email: user.email}}>
                    <AvatarInput>
                        <img src={user.avatarURL} alt={user.name} />
                        <label htmlFor="avatar">
                            <FiCamera />

                            <input type="file" id="avatar" onChange={handleAvatarChange}/>
                        </label>

                    </AvatarInput>

                    <h1>Meu perfil</h1>

                    <Input icon={FiUser} name="name" type="text" placeholder="Nome"/>
                    <Input icon={FiMail} name="email" type="text" placeholder="E-mail"/>

                    <Input containerStyle={{ marginTop: 24 }} 
                        icon={FiLock} name="oldPassword" type="password" placeholder="Senha atual"/>
                    <Input icon={FiLock} name="password" type="password" placeholder="Nova senha"/>
                    <Input icon={FiLock} name="passwordConfirmation" type="password" placeholder="Confirmar senha"/>

                    <Button type="submit">Confirmar mudanças</Button>   

                </Form>
            </Content>
        </Container>
    );
}

export default Profile;