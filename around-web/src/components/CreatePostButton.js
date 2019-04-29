import React from 'react';
import { Modal, Button, message } from 'antd';
import { WrappedCreatePostForm } from "./CreatePostForm"
import $ from 'jquery';
import {API_ROOT, POS_KEY} from "../constants"
import { AUTH_PREFIX} from "../constants"
import { TOKEN_KEY } from "../constants"
import { LOC_SHAKE } from "../constants"

export class CreatePostButton extends React.Component {
    state = {
        ModalText: 'Content of the modal',
        visible: false,
        confirmLoading: false,
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = () => {
        // collect value
        this.form.validateFields((err, values) => {
            if(!err) {
                //send request
                const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
                const formData = new FormData();
                formData.set('lat', lat + Math.random() * LOC_SHAKE * 2 - LOC_SHAKE);
                formData.set('lon', lon + Math.random() * LOC_SHAKE * 2 - LOC_SHAKE);
                formData.set('message', values.message);
                formData.set('image', values.image[0].originFileObj);
                $.ajax({
                    url: `${API_ROOT}/post`,
                    method: 'POST',
                    data: formData,
                    headers: {
                        Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`,
                    },
                    processDate: false,
                    contentType: false,
                    dataType: 'text',
                }).then(() => {
                    message.success('Create post succeed');
                    this.form.resetFields();
                    this.props.loadNearbyPost();
                    this.setState({
                        visible: false,
                        confirmLoading: false,
                    });
                }, () => {
                    message.error('Create post failed');
                    this.setState({
                        confirmLoading: false,
                    });
                }).catch((e) => {
                    console.log(e);
                });
            }
        });
        this.setState({
            ModalText: 'The modal will be closed after two seconds',
            confirmLoading: true,
        });
    }

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    }

    saveFormRef = (formInstance) => {
        this.form = formInstance;
    }

    render() {
        const { visible, confirmLoading, ModalText } = this.state;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    Create New Post
                </Button>
                <Modal
                    title="Create New Posts"
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    okText="Create"

                >
                <WrappedCreatePostForm ref={this.saveFormRef}/>
                </Modal>
            </div>
        );
    }
}

