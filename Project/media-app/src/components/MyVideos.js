import React, { useState, useEffect } from 'react';
import { Card, Container, Button, Row, Col } from 'react-bootstrap'
import MyNavbar from './MyNavbar'
import '../styles/MyVideos.css'
import { storage } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { useHistory } from "react-router-dom";
import ReactPlayer from 'react-player'

export default function MyVideos() {

    const { currentUser } = useAuth();
    const history = useHistory();
    const [list, setList] = useState([]);

    const storageRef = storage.ref()
    const [videoUrls, setVideoUrls] = useState([]);
    
    function loadVideos() {
        const videosRef = storageRef.child(`user/${currentUser.uid}`);
        videosRef.listAll().then(res => {
            res.items.forEach(resItem => {
                resItem.getDownloadURL().then(url => {
                    setVideoUrls(oldArray => [...oldArray, url]) // This line has changed!
                })
            })
        });
        console.log(videoUrls)
    }

    useEffect(() => {
        loadVideos()
    }, []);

    function navigateTo(navurl) {
        console.log(navurl);
        history.push({
            pathname: '/',
            state: { detail: navurl }
        })
        console.log(navurl);
    }






    return (
        <>
            <MyNavbar />
            <Container fluid className='main-container justify-content-center text-center mt-2'>
                <Card className='file-video-card'>
                    <Card.Body>
                        <Row>
                            {videoUrls.map((itemRef, index) => (
                                <Col xs={{ span: 4 }} key={index}>
                                    <div key={index}>
                                        <Button key={index} className='video-button' variant='primary' onClick={() => navigateTo(itemRef)}>
                                        <ReactPlayer className='video-play' url={itemRef} playing={false} width='100%' height='100%'/>
                                        </Button>
                                    </div>
                                </Col>

                            ))}
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        </>
    )
}