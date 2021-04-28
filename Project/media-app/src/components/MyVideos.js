import React, { useState } from 'react'
import { Card, Container, Button, Row, Col} from 'react-bootstrap'
import MyNavbar from './MyNavbar'
import '../styles/MyVideos.css'
import { storage } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { useHistory } from "react-router-dom";
import ReactPlayer from 'react-player'

export default function MyVideos() {

    const { currentUser } = useAuth()
    const [list, setList] = useState ([])
    // Create a reference under which you want to list
    var listRef = storage.ref(`user/${currentUser.uid}`)
    const history = useHistory();
    const [url, setUrl] = useState('');
    var num = 1
    function navigateTo (navurl){
        console.log(navurl);
        history.push({
            pathname: '/',
            state: { detail: navurl }
          })
            console.log(navurl);
    } 
    
    // Find all the prefixes and items.
    listRef.listAll()
        .then((res) => {
            var list2 = []
            res.items.forEach((itemRef) => {
                itemRef.getDownloadURL().then((url) => setUrl(url))
                list2.push(url)
            });
            setList(list2)
        }).catch((error) => {
            // Uh-oh, an error occurred!
        });
        
    return(
        <>
            <MyNavbar />
            <Container fluid className='main-container justify-content-center text-center mt-2'>
            <Card className='file-video-card'>
                    <Card.Body>
            {list.map((itemRef) => (
                <Row>
                    <Col>
                        <div>
                            <Button className='video-button' variant='primary' onClick={() => navigateTo(itemRef)}>
                            <ReactPlayer url={itemRef} playing={false}/></Button>
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
