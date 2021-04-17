import React, { useState } from 'react'
import { Card, Container, ProgressBar, Row, Col, Button } from 'react-bootstrap'
import MyNavbar from './MyNavbar'
import '../styles/Dashboard.css'
import { storage } from '../firebase'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState('');
    const [progress, setProgress] = useState(0);
    const { currentUser } = useAuth();


    const handleChange = e => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`user/${currentUser.uid}/${image.name}`).put(image);

        uploadTask.on(
            'state_changed',
            snapshot => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            error => {
                console.log(error);
            },
            () => {
                storage
                    .ref(`user/${currentUser.uid}`)
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        setUrl(url)
                    })
            }
        )
    }

    return (
        <>
            <MyNavbar />
            <Container fluid className='main-container justify-content-center'>

                <Card className='file-upload-card'>
                    <Card.Img variant="top" src={url} />
                <Card.Body>
                    <ProgressBar animated now={progress} label={`${progress}%`} md="auto" />
                    <Row>
                        <Col className='col-8'>
                            <input type='file' class='form-control' className='input-form' onChange={handleChange} />
                        </Col>
                        <Col>
                            <Button className='upload-button' variant='primary' onClick={handleUpload}>Upload</Button>
                        </Col>
                    </Row>


                </Card.Body>
                </Card>

        </Container>
        </>
    )
}
