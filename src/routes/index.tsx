import React from 'react';
import {Switch} from 'react-router-dom';
import Route from './Route';
import SignUp from '../pages/SignUp/Index';
import SignIn from '../pages/SignIn/Index';
import Dashboard from '../pages/Dashboard/index';
import ForgotPassword from '../pages/ForgotPassword/Index';
import ResetPassword from '../pages/ResetPassword/Index';
import Profile from '../pages/Profile/Index';

const Routes: React.FC = () => (
    <Switch>
        <Route path='/' exact component={SignIn}/>
        <Route path='/signup' component={SignUp}/>
        <Route path='/forgot-password' component={ForgotPassword}/>
        <Route path='/reset-password' component={ResetPassword}/>

        <Route path='/profile' component={Profile} isPrivate/>
        <Route path='/dashboard' component={Dashboard} isPrivate/>
    </Switch>
);

export default Routes;