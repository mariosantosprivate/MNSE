import React, { useState } from 'react'
import { Card, Container, Button, Row, Col} from 'react-bootstrap'
import MyNavbar from './MyNavbar'
import '../styles/MyVideos.css'
import { storage } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from "react-router-dom";
import VideoThumbnail from 'react-video-thumbnail';

export default function MyVideos() {

    const { currentUser } = useAuth()
    const [list, setList] = useState ([])
    // Create a reference under which you want to list
    var listRef = storage.ref(`user/${currentUser.uid}`)
    const history = useHistory();

    function navigateTo (url){
        console.log(url);
        history.push({
            pathname: '/',
            state: { detail: url }
          })
            console.log(url);
    } 
    
    // Find all the prefixes and items.
    listRef.listAll()
        .then((res) => {
            var list2 = []
            res.items.forEach((itemRef) => {
                list2.push(itemRef)
            });
            setList(list2)
        }).catch((error) => {
            // Uh-oh, an error occurred!
        });

        function handleThumbnail (url){

        } 
        
    return(
        <>
            <MyNavbar />
            <Container fluid className='main-container justify-content-center text-center mt-2'>
            <Card className='file-upload-card'>
                    <Card.Body>
            {list.map((itemRef) => (
                <Row>
                    <Col>
                        <div>
                            {itemRef.name}
                            <Button className='upload-button' variant='primary' onClick={() => itemRef.getDownloadURL().then((url) => navigateTo(url))}>
                                {<VideoThumbnail videoUrl={itemRef.getDownloadURL().then((url) => handleThumbnail(url))} />}</Button>
                        </div>
                    </Col>
                </Row>
            ))}
                </Card.Body>
                </Card>
            </Container>
        </>
    )
}
