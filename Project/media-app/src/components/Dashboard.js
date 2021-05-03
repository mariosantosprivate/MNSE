import React, { useState, useEffect } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { Card, Container, ProgressBar, Row, Col, Button, InputGroup, FormControl } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import { storage } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import MyNavbar from './MyNavbar';
import '../styles/Dashboard.css';
import { useHistory, useLocation } from "react-router-dom";

const ffmpeg = createFFmpeg({ log: true })


export default function Dashboard() {

    //const [url, setUrl] = useState('');
    const [ffmpegReady, setFfmpegReady] = useState(false);
    const [file, setFile] = useState('./');
    const [editedVideo, setEditedVideo] = useState('./')
    const [progress, setProgress] = useState(0);
    const { currentUser } = useAuth();
    const [startTrim, setStartTrim] = useState(0);
    const [endTrim, setEndTrim] = useState(0);
    const [uploadName, setUploadName] = useState('')
    const [uploadFile, setUploadFile] = useState(null)
    //const [seeking, setSeeking] = useState(false);
    const [played, setPlayed] = useState(0);
    const [player, setPlayer] = useState(null)
    const [duration, setDuration] = useState(0)

    const location = useLocation();

    useEffect(() => {
       if(location.state){
        setFile(location.state.detail); // result: 'some_value'
        setEditedVideo(location.state.detail)
       }
        
    }, [location]);

    const convertSecondsToTime = (seconds) => {
        let hours = Math.floor(seconds / 3600);
        let mins = Math.floor(seconds / 60 % 60);
        let secs = Math.floor(seconds % 60);

        hours < 10 ? hours = `0${hours}` : hours = `${hours}`
        mins < 10 ? mins = `0${mins}` : mins = `${mins}`
        secs < 10 ? secs = `0${secs}` : secs = `${secs}`

        return `${hours}:${mins}:${secs}`
    }

    const loadFfmpeg = async () => {
        await ffmpeg.load();
        setFfmpegReady(true);
    }

    const handleLoadedVideo = () => {

        setDuration(player.getDuration())
    }


    const trimVideo = async () => {
        if (ffmpegReady) {
            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(file));

            /*let startHours = Math.floor(start / 3600);
            let startMins = Math.floor(start / 60 % 60);
            let startSecs = Math.floor(start % 60);
            let startTime = `${startHours}:${startMins}:${startSecs}`
     
     
            let endHours = Math.floor(end / 3600);
            let endMins = Math.floor(end / 60 % 60);
            let endSecs = Math.floor(end % 60);
            let endTime = `${endHours}:${endMins}:${endSecs}`
            */
            // Run trim command
            await ffmpeg.run('-i', 'test.mp4', '-ss', startTrim, '-to', endTrim, '-c:v', 'copy', '-c:a', 'copy', 'testOut.mp4');

            // Read result
            const data = ffmpeg.FS('readFile', 'testOut.mp4');

            // Update upload file
            setUploadFile(new Blob([data.buffer], { type: 'video/mp4' }))

            // Create URL
            const editedVideoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
            setEditedVideo(editedVideoUrl)
        }

    }

    const contrastVideo = async () => {
        if (ffmpegReady) {
            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(file));
            
            // Run trim command
            await ffmpeg.run('-i', 'test.mp4', '-ss', startTrim, '-to', endTrim, '-c:v', 'copy', '-c:a', 'copy', 'testOut.mp4');

            // Read result
            const data = ffmpeg.FS('readFile', 'testOut.mp4');

            // Update upload file
            setUploadFile(new Blob([data.buffer], { type: 'video/mp4' }))

            // Create URL
            const editedVideoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
            setEditedVideo(editedVideoUrl)
        }

    }

    const brightnessVideo = async () => {
        if (ffmpegReady) {
            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(file));
            
            // Run trim command
            await ffmpeg.run('-i', 'test.mp4', '-vf', 'eq=brightness=0.0:saturation=0', '-c:a', 'copy', 'testOut.mp4');

            // Read result
            const data = ffmpeg.FS('readFile', 'testOut.mp4');

            // Update upload file
            setUploadFile(new Blob([data.buffer], { type: 'video/mp4' }))

            // Create URL
            const editedVideoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
            setEditedVideo(editedVideoUrl)
        }

    }

    const saturationVideo = async () => {
        if (ffmpegReady) {
            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(file));

            // Run trim command
            await ffmpeg.run('-i', 'test.mp4', '-ss', startTrim, '-to', endTrim, '-c:v', 'copy', '-c:a', 'copy', 'testOut.mp4');

            // Read result
            const data = ffmpeg.FS('readFile', 'testOut.mp4');

            // Update upload file
            setUploadFile(new Blob([data.buffer], { type: 'video/mp4' }))

            // Create URL
            const editedVideoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
            setEditedVideo(editedVideoUrl)
        }

    }

    const sharpnessVideo = async () => {
        if (ffmpegReady) {
            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(file));

            // Run trim command
            await ffmpeg.run('-i', 'test.mp4', '-ss', startTrim, '-to', endTrim, '-c:v', 'copy', '-c:a', 'copy', 'testOut.mp4');

            // Read result
            const data = ffmpeg.FS('readFile', 'testOut.mp4');

            // Update upload file
            setUploadFile(new Blob([data.buffer], { type: 'video/mp4' }))

            // Create URL
            const editedVideoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
            setEditedVideo(editedVideoUrl)
        }

    }

    const colourVideo = async () => {
        if (ffmpegReady) {
            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(file));

            // Run trim command
            await ffmpeg.run('-i', 'test.mp4', '-ss', startTrim, '-to', endTrim, '-c:v', 'copy', '-c:a', 'copy', 'testOut.mp4');

            // Read result
            const data = ffmpeg.FS('readFile', 'testOut.mp4');

            // Update upload file
            setUploadFile(new Blob([data.buffer], { type: 'video/mp4' }))

            // Create URL
            const editedVideoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
            setEditedVideo(editedVideoUrl)
        }

    }

    const handleSelectFile = e => {
        setFile(URL.createObjectURL(e.target.files?.item(0)));
        setUploadFile(e.target.files?.item(0));
        setEditedVideo(URL.createObjectURL(e.target.files?.item(0)))

    }


    //console.log(history.location.state.detail)

    const handleUpload = () => {
        const uploadTask = storage.ref(`user/${currentUser.uid}/${uploadName}`).put(uploadFile);

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
            }
            /** 
            ,
            () => {
                storage
                    .ref(`user/${currentUser.uid}`)
                    .child(uploadName)
                    .getDownloadURL()
                    .then(url => {
                        setUrl(url)
                    })
            }
            */
        )
    }


    const handleSeekChange = e => {
        setPlayed(parseFloat(e.target.value))
    }

    const handleSeekMouseUp = e => {
        player.seekTo(parseFloat(e.target.value))
    }

    useEffect(() => {
        loadFfmpeg();
    }, [])

    const ref = myPlayer => {
        setPlayer(myPlayer)
    }

    return ffmpegReady ? (
        <>
            <MyNavbar />
            <Container fluid className='main-container justify-content-center'>
                <Row>
                    <Card className='file-upload-card'>
                        <Card.Body>
                            <Row className='justify-content-center'>
                                <input type='file' className='input-form' onChange={handleSelectFile} />
                            </Row>
                            <ProgressBar animated now={progress} label={`${progress}%`} md="auto" />
                            <br></br>
                            <Row>
                                <Col className='col-8'>
                                    <InputGroup>
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="upload-name-input">Name</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            placeholder="Save as..."
                                            aria-label="Save as..."
                                            aria-describedby="upload-name-input"
                                            onChange={e => setUploadName(`${e.target.value}.mp4`)}
                                        />
                                    </InputGroup>
                                </Col>
                                <Col>
                                    <Button className='upload-button' variant='primary' onClick={handleUpload}>Upload</Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Row>

                <Row >
                    <Col xs={{ span: 10, offset: 1 }} sm={{ span: 6, offset: 0 }}>
                        <div className='player-wrapper'>
                            <ReactPlayer
                                className='react-player'
                                url={file}
                                controls={true}
                                width='100%'
                                height='100%'
                            />
                        </div>
                    </Col>
                    <Col xs={{ span: 10, offset: 1 }} sm={{ span: 6, offset: 0 }}>
                        <div className='player-wrapper'>
                            <ReactPlayer
                                ref={ref}
                                className='react-player'
                                url={editedVideo}
                                onReady={handleLoadedVideo}
                                controls={true}
                                width='100%'
                                height='100%'
                            />
                        </div>
                    </Col>
                </Row>
                <Row className='justify-content-center'>
                    <Col xs={{ span: 10, offset: 1 }} sm={{ span: 8, offset: 2 }} className='seeker-wrapper'>
                        <input className='seek-bar'
                            type='range' min={0} max={0.999999} step='any'
                            value={played}
                            //onMouseDown={handleSeekMouseDown}
                            onChange={handleSeekChange}
                            onMouseUp={handleSeekMouseUp}
                            //onTouchStart={handleSeekMouseDown}   
                            onTouchMove={handleSeekChange}
                            onTouchEnd={handleSeekMouseUp}
                        />
                    </Col>
                </Row>
                <Row className='justify-content-center' style={{
                    textAlign: 'center'
                }}>
                    <Col>00:00:00</Col>
                    <Col>{convertSecondsToTime(played * duration)}</Col>
                    <Col>{convertSecondsToTime(duration)}</Col>
                </Row>
                <Row style={{
                    'justifyContent': 'center',
                    'textAlign': 'center'
                }}>
                    <Col xs={{ span: 4 }} sm={{ span: 3 }}>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="trim-start-input">Start</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="Start time in seconds..."
                                aria-label="Start Trim"
                                aria-describedby="trim-start-input"
                                onChange={e => setStartTrim(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col xs={{ span: 4 }} sm={{ span: 3 }}>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="trim-end-input">End</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="End time in seconds..."
                                aria-label="End Trim"
                                aria-describedby="trim-end-input"
                                onChange={e => setEndTrim(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                </Row>
                <Row style={{
                    'justifyContent': 'center',
                    'textAlign': 'center'
                }}>
                    <Col xs={{ span: 4 }} sm={{ span: 3 }}>
                        <Button className='trim-button' onClick={trimVideo}>Trim</Button>
                    </Col>
                    <Col xs={{ span: 4 }} sm={{ span: 3 }}>
                        <Button className='trim-button' onClick={contrastVideo}>Contrast</Button>
                    </Col>
                    <Col xs={{ span: 4 }} sm={{ span: 3 }}>
                        <Button className='trim-button' onClick={brightnessVideo}>Brightness</Button>
                    </Col>
                    <Col xs={{ span: 4 }} sm={{ span: 3 }}>
                        <Button className='trim-button' onClick={saturationVideo}>Saturation</Button>
                    </Col>
                    <Col xs={{ span: 4 }} sm={{ span: 3 }}>
                        <Button className='trim-button' onClick={sharpnessVideo}>Sharpness</Button>
                    </Col>
                    <Col xs={{ span: 4 }} sm={{ span: 3 }}>
                        <Button className='trim-button' onClick={colourVideo}>Colour</Button>
                    </Col>
                </Row>
                    </Container>
                </>
    ) :
        (<p>Loading FFmpeg...</p>)

}