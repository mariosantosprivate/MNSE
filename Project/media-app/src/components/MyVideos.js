import React, { useState, useEffect } from 'react';
import { Card, Container, Button, Row, Col } from 'react-bootstrap'
import MyNavbar from './MyNavbar'
import '../styles/MyVideos.css'
import { storage } from '../firebase'
import { useAuth } from '../contexts/AuthContext'

export default function MyVideos() {

    const { currentUser } = useAuth()
    const [list, setList] = useState([])
    // Create a reference under which you want to list
    var listRef = storage.ref(`user/${currentUser.uid}`)
    const [url, setUrl] = useState('');



    useEffect(() => {
        console.log('UsingEffect')
        // Find all the prefixes and items.
        listRef.listAll()
            .then((res) => {
                var list2 = []
                res.items.forEach((itemRef) => {
                    itemRef.getDownloadURL().then((url) => setUrl(url))
                    console.log(itemRef.getMetadata())
                    list2.push(url)
                });
                setList(list2)
            }).catch((error) => {
                // Uh-oh, an error occurred!
            });

    }, []);




    return (
        <>
            <MyNavbar />
            <Container fluid className='main-container justify-content-center text-center mt-2'>
                <Card className='file-video-card'>
                    <Card.Body>
                        <Row>
                            {list.map((itemRef, index) => (

                                <Col xs={{ span: 3 }} key={index}>
                                    <div key={index}>
                                        <Button key={index} className='video-button' variant='primary'
                                            href={itemRef}
                                            download={'video.mp4'}
                                        >
                                            {itemRef}
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
