import React from 'react';
import { Tabs, Spin, Row, Col, Radio } from 'antd';
import { GEO_OPTIONS, POS_KEY, API_ROOT, TOKEN_KEY, AUTH_PREFIX } from '../constants';
import $ from 'jquery';
import { Gallery } from './Gallery'
import { CreatePostButton } from "./CreatePostButton"
import { WrappedAroundMap } from "./AroundMap"

const RadioGroup = Radio.Group;

export class Home extends React.Component {

    state = {
        loadingGeoLocation: false,
        loadingPosts: false,
        posts: '',
        error: '',
        topic: 'around',
    }

    componentDidMount() {
        this.setState({ loadingGeoLocation: true, error: '' });
        this.getGeoLocation();
    }

    getGeoLocation = () => {
        if("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeoLocation,
                this.onFailedLoadGeoLocation,
                GEO_OPTIONS
            );
        } else {
            this.setState({ loadingGeoLocation: false, error: 'Your browsers does not support' });
        }
    }

    onSuccessLoadGeoLocation = (position) => {
        this.setState({ loadingGeoLocation: false, error: '' });
        console.log(position);
        const {latitude, longitude }= position.coords;
        localStorage.setItem(POS_KEY, JSON.stringify({lat: latitude, lon: longitude}));
        this.loadNearbyPost();
    }

    onFailedLoadGeoLocation = () => {
        console.log('failed to load geo location');
        this.setState({ loadingGeoLocation: false, error: 'Fail to load geo location' });
    }

    loadNearbyPost = (location, radius) => {
        this.setState({loadingPosts: true, error: ''});
        const {lat, lon} = location ? location : JSON.parse(localStorage.getItem(POS_KEY));
        const range = radius ? radius : 20;
        const endPoint = this.state.topic === 'around' ? 'search' : 'cluster';
        const term = this.state.topic === 'around' ? '' : 'face';
        $.ajax ({
            url: `${API_ROOT}/${endPoint}?lat=${lat}&lon=${lon}$range=${range}&term=${term}`,
            method: 'GET',
            headers: {
                Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`,
            }
        }).then((response) => {
            const posts = response ? response : [];
            this.setState({posts, loadingPosts: false, error: ''});
            console.log(response);
        }, (response) => {
            console.log(response.responseText);
            this.setState({ loadingPosts: false, error: 'failed to loading posts'});
        }).catch((e) => {
            console.log(e);
        });
    }

    getResult = (type) => {
        if (this.state.error) {
            return <div>{this.state.error}</div>;
        } else if (this.state.loadingGeoLocation) {
            return <Spin tip="Loading geo Location..."/>;
        } else if (this.state.loadingPosts) {
            return <Spin tip="Loading posts..."/>;
        } else if (this.state.post) {
            return type === 'images' ? this.getImagePosts() : this.getVideoPosts();
        } else {
            return <div>Content of tab 1</div>;
        }
    }

    getImagePosts = () => {
        const images = this.state.posts
            .filter((post) => post.type === 'image')
            .map((post) => {
                return {
                    user: post.user,
                    src: post.url,
                    thumbnail: post.url,
                    caption: post.message,
                    thumbnailWidth: 400,
                    thumbnailHeight: 300,
                }
            });
        return <Gallery images={images}/>;
    }

    getVideoPosts = () => {
        return (
            <Row gutter={32}>
                {this.state.posts
                .filter((post) => post.type === 'video')
                .map((post) => <Col span={6} key={post.url}><video src={post.url} controls className="video-block"/></Col>)
                }
            </Row>
        );
    }

    onTopicChange = (e) => {
        this.setState({ topic: e.target.value}, this.loadNearbyPost);
    }

    render() {
        const TabPane = Tabs.TabPane;
        const operations = <CreatePostButton loadNearbyPost={this.loadNearbyPost}/>;
        return (
            <div>
                <RadioGroup onChange={this.onTopicChange} value={this.state.topic} className="topic-radio">
                    <Radio value="around">Posts Around Me</Radio>
                    <Radio value="face">Faces Around The World</Radio>
                </RadioGroup>

                <Tabs tabBarExtraContent={operations} className="main-tabs">
                    <TabPane tab="Image_Posts" key="1">
                        {this.getResult('image')}
                    </TabPane>
                    <TabPane tab="Video_Posts" key="2">
                        {this.getResult('video')}
                    </TabPane>
                    <TabPane tab="Map" key="3">
                        <WrappedAroundMap
                            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD3CEh9DXuyjozqptVB5LA-dN7MxWWkr9s&v=3.exp&libraries=geometry,drawing,places"
                            loadingElement={<div style={{ height: `100%` }} />}
                            containerElement={<div style={{ height: `650px` }} />}
                            mapElement={<div style={{ height: `100%` }} />}
                            posts={this.state.posts}
                            loadNearbyPost={this.loadNearbyPost}
                        />
                    </TabPane>
                </Tabs>
            </div>

        );
    }
}