import React, { useState } from 'react'
import { Card, Container, ProgressBar, Row, Col, Button } from 'react-bootstrap'
import MyNavbar from './MyNavbar'
import '../styles/Dashboard.css'
import { storage } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import ReactPlayer from 'react-player'

export default function Dashboard() {
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState('');
    const [progress, setProgress] = useState(0);
    const { currentUser } = useAuth();


    const handleChange = e => {
        if (e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`user/${currentUser.uid}/${file.name}`).put(file);

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
                    .child(file.name)
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
                    <Card.Body>
                        <ProgressBar animated now={progress} label={`${progress}%`} md="auto" />
                        <br></br>
                        <Row>
                            <Col className='col-8'>
                                <input type='file' class='form-control' className='input-form' onChange={handleChange} />
                            </Col>
                            <Col>
                                <Button className='upload-button' variant='primary' onClick={handleUpload}>Upload</Button>
                            </Col>
                        </Row>
                        <br></br>
                        <Row>
                            <ReactPlayer url={url} playing={true}/>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        </>
    )
}
