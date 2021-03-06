import React from 'react';
import {
    Form, Icon, Input, Button, message
} from 'antd';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { API_ROOT} from "../constants"



class NormalLoginForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                $.ajax({
                    url: `${API_ROOT}/login`,
                    method: 'POST',
                    data: JSON.stringify({
                        username: values.username,
                        password: values.password,
                    })
                }).then((response) => {
                    message.success('login success!');
                    this.props.handleLogin(response);
                    // const token = response;
                    // localStorage.setItem('TOKEN_KEY', token);

                    console.log(response);

                },(response) => {
                    message.error(response.responseText);
                }).catch((e) => {
                    console.log(e);
                });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <h1 >Please Login</h1>
                <p>Welcome back<br/>
                    Please sign in with your account</p>

            <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                    Or <Link to="/register">register now!</Link>
                </Form.Item>
            </Form>
            </div>
        );
    }
}

export const Login = Form.create({ name: 'normal_login' })(NormalLoginForm);
