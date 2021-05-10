import React, { useState, useEffect, useRef } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { Card, Container, ProgressBar, Row, Col, Button, InputGroup, FormControl } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import { storage } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import MyNavbar from './MyNavbar';
import Waveform from './Waveform'
import '../styles/Dashboard.css';
import { useLocation } from "react-router-dom";
import RangeSlider from 'react-bootstrap-range-slider';

const ffmpeg = createFFmpeg({
    log: true,
})

export default function Dashboard() {

    const [ffmpegReady, setFfmpegReady] = useState(false);
    const [file, setFile] = useState('./');
    const [editedVideo, setEditedVideo] = useState('./')
    const [editedAudio, setEditedAudio] = useState(new Blob([], { type: 'audio/mp3' }))
    const [progress, setProgress] = useState(0);
    const { currentUser } = useAuth();
    const [startTrim, setStartTrim] = useState(0);
    const [endTrim, setEndTrim] = useState(0);
    const [uploadName, setUploadName] = useState('')
    const [uploadFile, setUploadFile] = useState(new Blob([], { type: 'video/mp4' }))
    const [played, setPlayed] = useState(0);
    const [player, setPlayer] = useState(null)
    const [duration, setDuration] = useState(0)
    const [brightness, setBrightness] = useState(0)
    const [contrast, setContrast] = useState(1)
    const [saturation, setSaturation] = useState(1)
    const [lumax, setLumax] = useState(5)
    const [lumay, setLumay] = useState(5)
    const [lumaAmount, setLumaAmount] = useState(1)
    const [chromax, setChromax] = useState(5)
    const [chromay, setChromay] = useState(5)
    const [chromaAmount, setchromaAmount] = useState(0)
    const [lumaRadius, setLumaRadius] = useState(1)
    const [lumaStrength, setLumaStrength] = useState(1)
    const [lumaThreshold, setLumaThreshold] = useState(0)
    const [chromaRadius, setChromaRadius] = useState(1)
    const [chromaStrength, setChromaStrength] = useState(1)
    const [chromaThreshold, setchromaThreshold] = useState(0)
    const [hue, setHue] = useState(0)
    const [hueSaturation, setHueSaturation] = useState(1)
    const [hueBrightness, setHueBrightness] = useState(0)
    const [gamma, setGamma] = useState(1)
    const [selectedFileName, setSelectedFileName] = useState('Choose File')

    const location = useLocation();

    useEffect(() => {
        if (location.state) {
            setFile(location.state.detail); // rSesult: 'some_value'
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

    const brightnessVideo = async () => {
        if (ffmpegReady) {
            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(file));
            // Run command
            await ffmpeg.run('-i', 'test.mp4', '-vf', `eq=brightness=${brightness}`, '-c:a', 'copy', 'testOut.mp4');

            // Read result
            const data = ffmpeg.FS('readFile', 'testOut.mp4');

            // Update upload file
            setUploadFile(new Blob([data.buffer], { type: 'video/mp4' }))

            // Create video URL react-player
            const editedVideoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
            setEditedVideo(editedVideoUrl)
        }

    }

    const splitAudioVideo = async () => {
        if (ffmpegReady) {
            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'video.mp4', await fetchFile(file));

            // Run command
            await ffmpeg.run('-i', 'video.mp4', '-q:a', '0', '-map', 'a', 'audio.mp3')

            // Read result
            const data = ffmpeg.FS('readFile', 'audio.mp3');

            // Create video URL react-player
            const audioBlob = new Blob([data.buffer], { type: 'audio/mp3' });
            setEditedAudio(audioBlob);




        }
    }

    const trimVideo = async () => {
        if (ffmpegReady) {
            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(file));


            // Run command
            await ffmpeg.run('-i', 'test.mp4', '-ss', startTrim, '-to', endTrim, '-c:v', 'copy', '-c:a', 'copy', 'testOut.mp4');

            // Read result
            const data = ffmpeg.FS('readFile', 'testOut.mp4');

            // Update upload file
            setUploadFile(new Blob([data.buffer], { type: 'video/mp4' }))

            // Create video URL react-player
            const editedVideoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
            setEditedVideo(editedVideoUrl)
        }

    }

    const contrastVideo = async () => {
        if (ffmpegReady) {
            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(file));

            // Run command
            await ffmpeg.run('-i', 'test.mp4', '-vf', `eq=contrast=${contrast}`, '-c:a', 'copy', 'testOut.mp4');

            // Read result
            const data = ffmpeg.FS('readFile', 'testOut.mp4');

            // Update upload file
            setUploadFile(new Blob([data.buffer], { type: 'video/mp4' }))

            // Create video URL react-player
            const editedVideoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
            setEditedVideo(editedVideoUrl)
        }

    }

    const saturationVideo = async () => {
        if (ffmpegReady) {
            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(file));

            // Run command
            await ffmpeg.run('-i', 'test.mp4', '-vf', `eq=saturation=${saturation}`, '-c:a', 'copy', 'testOut.mp4');

            // Read result
            const data = ffmpeg.FS('readFile', 'testOut.mp4');

            // Update upload file
            setUploadFile(new Blob([data.buffer], { type: 'video/mp4' }))

            // Create video URL react-player
            const editedVideoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
            setEditedVideo(editedVideoUrl)
        }

    }

    const gammaVideo = async () => {
        if (ffmpegReady) {
            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(file));

            // Run command
            await ffmpeg.run('-i', 'test.mp4', '-vf', `eq=gamma=${gamma}`, '-c:a', 'copy', 'testOut.mp4');

            // Read result
            const data = ffmpeg.FS('readFile', 'testOut.mp4');

            // Update upload file
            setUploadFile(new Blob([data.buffer], { type: 'video/mp4' }))

            // Create video URL react-player
            const editedVideoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
            setEditedVideo(editedVideoUrl)
        }

    }

    const sharpnessVideo = async () => {
        if (ffmpegReady) {
            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(file));

            // Run command
            await ffmpeg.run('-i', 'test.mp4', '-vf', `unsharp=${lumax}:${lumay}:${lumaAmount}:${chromax}:${chromay}:${chromaAmount}`, '-c:a', 'copy', 'testOut.mp4');

            // Read result
            const data = ffmpeg.FS('readFile', 'testOut.mp4');

            // Update upload file
            setUploadFile(new Blob([data.buffer], { type: 'video/mp4' }))

            // Create video URL react-player
            const editedVideoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
            setEditedVideo(editedVideoUrl)
        }

    }

    const BlurVideo = async () => {
        if (ffmpegReady) {
            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(file));

            // Run command
            await ffmpeg.run('-i', 'test.mp4', '-vf', `smartblur=${lumaRadius}:${lumaStrength}:${lumaThreshold}:${chromaRadius}:${chromaStrength}:${chromaThreshold}`, '-c:a', 'copy', 'testOut.mp4');

            // Read result
            const data = ffmpeg.FS('readFile', 'testOut.mp4');

            // Update upload file
            setUploadFile(new Blob([data.buffer], { type: 'video/mp4' }))

            // Create video URL react-player
            const editedVideoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
            setEditedVideo(editedVideoUrl)
        }

    }

    const colourVideo = async () => {
        if (ffmpegReady) {
            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(file));

            // Run command
            await ffmpeg.run('-i', 'test.mp4', '-vf', `hue=h=${hue}:s=${hueSaturation}:b=${hueBrightness}`, '-c:a', 'copy', 'testOut.mp4');

            // Read result
            const data = ffmpeg.FS('readFile', 'testOut.mp4');

            // Update upload file
            setUploadFile(new Blob([data.buffer], { type: 'video/mp4' }))

            // Create video URL react-player
            const editedVideoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
            setEditedVideo(editedVideoUrl)
        }

    }

    const handleSelectFile = (e) => {
        setSelectedFileName(inputRef.current.files[0].name)
        setFile(URL.createObjectURL(e.target.files?.item(0)));
        setUploadFile(e.target.files?.item(0));
        setEditedVideo(URL.createObjectURL(e.target.files?.item(0)))

    }

    const handleUpload = (e) => {
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

    const inputRef = useRef();

    return ffmpegReady ? (
        <>
            <MyNavbar />
            <Container fluid className='main-container justify-content-center'>
                <Row className='major-row'>
                    <Col xs={{ span: 10, offset: 1 }}>
                        <Card className='file-upload-card'>
                            <Card.Body>
                                <Row className='justify-content-center'>
                                    <div className="custom-file">
                                        <input ref={inputRef} type="file" className="custom-file-input" id="customFile" onChange={handleSelectFile} />
                                        <label className="custom-file-label" htmlFor="customFile">{selectedFileName}</label>
                                    </div>
                                </Row>
                                <Row>
                                </Row>
                                <ProgressBar animated now={progress} label={`${progress}%`} md="auto" className='progress-bar-custom' />
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
                                        <Button className='upload-button' variant='success' onClick={handleUpload}>Upload</Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className='major-row'>
                    <Col xs={{ span: 10, offset: 1 }}>
                        <Card bg='dark' border="warning" style={{ color: '#ffc107' }}>
                            <Card.Header>Warning</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    If you were directed to this page after selecting a video from 'Videos' please right-click on the '...' in the 'Original' video player, download the video, and then upload it to allow editing.
                            </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className='major-row'>
                    <Col xs={{ span: 10, offset: 1 }}>
                        <Row>
                            <Col xs={{ span: 12 }} sm={{ span: 6 }}>
                                <Card bg='dark' text='white'>
                                    <Card.Header className='card-header'>Original</Card.Header>
                                    <Card.Body>
                                        <div className='player-wrapper'>
                                            <ReactPlayer
                                                className='react-player'
                                                url={file}
                                                controls={true}
                                                width='100%'
                                                height='100%'
                                            />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>


                            <Col xs={{ span: 12 }} sm={{ span: 6 }}>
                                <Card bg='dark' text='white'>
                                    <Card.Header className='card-header'>Preview</Card.Header>
                                    <Card.Body>
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
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className='major-row'>
                    <Col xs={{ span: 10, offset: 1 }}>
                        <Card bg='dark' text='white'>
                            <Card.Header className='card-header'>Audio</Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <Button variant='secondary' onClick={splitAudioVideo} className='apply-button'>Split Video/Audio Tracks</Button>
                                    </Col>
                                </Row>
                                <Row className='justify-content-center'>
                                    <Col className='justify-content-center'>
                                        <Waveform blob={editedAudio}></Waveform>
                                    </Col>
                                </Row>

                                <Row className='justify-content-center'>
                                    <Col>
                                        <Card bg='dark' text='white'>
                                            <Card.Header className='card-header card-header-custom'>Fade In</Card.Header>
                                            <Card.Body className='card-custom'>
                                                <Row style={{
                                                    'justifyContent': 'center',
                                                    'textAlign': 'center',
                                                    'padding': '1%'
                                                }}>
                                                    <Col xs={{ span: 4 }} sm={{ span: 4 }}>
                                                        <InputGroup>
                                                            <FormControl
                                                                placeholder="Start fade-in"
                                                                aria-label="Start Fade-In"
                                                                aria-describedby="fade-in-start-input"
                                                                onChange={e => setStartTrim(e.target.value)}
                                                            />
                                                        </InputGroup>
                                                    </Col>
                                                    <Col xs={{ span: 4 }} sm={{ span: 4 }}>
                                                        <InputGroup className='input-box'>
                                                            <FormControl
                                                                placeholder="End fade-in"
                                                                aria-label="End fade-in"
                                                                aria-describedby="fade-in-end-input"
                                                                onChange={e => setEndTrim(e.target.value)}
                                                            />
                                                        </InputGroup>
                                                    </Col>

                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <Button variant='secondary' className='apply-button' onClick={trimVideo}>Apply</Button>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card bg='dark' text='white'>
                                            <Card.Header className='card-header card-header-custom'>Fade Out</Card.Header>
                                            <Card.Body className='card-custom'>
                                                <Row style={{
                                                    'justifyContent': 'center',
                                                    'textAlign': 'center',
                                                    'padding': '1%'
                                                }}>
                                                    <Col xs={{ span: 4 }} sm={{ span: 4 }}>
                                                        <InputGroup>
                                                            <InputGroup.Prepend>
                                                                <InputGroup.Text id="fade-out-start-input">Start</InputGroup.Text>
                                                            </InputGroup.Prepend>
                                                            <FormControl
                                                                placeholder="...seconds"
                                                                aria-label="Start Fade-out"
                                                                aria-describedby="fade-out-start-input"
                                                                onChange={e => setStartTrim(e.target.value)}
                                                            />
                                                        </InputGroup>
                                                    </Col>
                                                    <Col xs={{ span: 4 }} sm={{ span: 4 }}>
                                                        <InputGroup className='input-box'>
                                                            <FormControl
                                                                placeholder="End fade-out"
                                                                aria-label="End fade-out"
                                                                aria-describedby="fade-out-end-input"
                                                                onChange={e => setEndTrim(e.target.value)}
                                                            />
                                                        </InputGroup>
                                                    </Col>

                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <Button variant='secondary' className='apply-button' onClick={trimVideo}>Apply</Button>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <Button variant='secondary' onClick={splitAudioVideo} className='apply-button'>Merge Video/Audio Tracks</Button>
                                    </Col>
                                </Row>

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className='major-row'>
                    <Col xs={{ span: 10, offset: 1 }}>
                        <Card bg='dark' text='white'>
                            <Card.Header className='card-header'>Trim</Card.Header>
                            <Card.Body>

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
                                    'textAlign': 'center',
                                    'padding': '1%'
                                }}>
                                    <Col xs={{ span: 4 }} sm={{ span: 4 }}>
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
                                    <Col xs={{ span: 4 }} sm={{ span: 4 }}>
                                        <InputGroup className='input-box'>
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
                                    <Col xs={{ span: 4 }} sm={{ span: 2 }}>
                                        <Button variant='secondary' className='trim-button' onClick={trimVideo}>Apply</Button>
                                    </Col>
                                </Row>

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className='major-row'>
                    <Col xs={{ span: 10, offset: 1 }}>
                        <Card style={{ textAlign: 'center' }} bg='dark' text='white'>
                            <Card.Header className='card-header'>Image Adjustments</Card.Header>
                            <Card.Body>
                                <Row className='large-slider-row'>

                                    <Col xs={{ span: 7, offset: 1 }} sm={{ span: 6, offset: 2 }} className='seeker-wrapper'>
                                        <Row className='large-slider-label-row'>
                                            Brightness
                                </Row>
                                        <RangeSlider
                                            variant='light'
                                            min={-1.0}
                                            max={1.0}
                                            step={0.1}
                                            value={brightness}
                                            onChange={changeEvent => setBrightness(changeEvent.target.value)}
                                        />
                                    </Col>
                                    <Col xs={{ span: 4 }} sm={{ span: 3 }}>
                                        <Button variant='secondary' className='apply-button' onClick={brightnessVideo}>Apply</Button>
                                    </Col>
                                </Row>
                                <Row className='large-slider-row'>
                                    <Col xs={{ span: 7, offset: 1 }} sm={{ span: 6, offset: 2 }} className='seeker-wrapper'>
                                        <Row className='large-slider-label-row'>
                                            Contrast
                                </Row>
                                        <RangeSlider
                                            variant='light'
                                            min={-1000.0}
                                            max={1000.0}
                                            step={0.1}
                                            value={contrast}
                                            onChange={changeEvent => setContrast(changeEvent.target.value)}
                                        />
                                    </Col>
                                    <Col xs={{ span: 4 }} sm={{ span: 3 }}>
                                        <Button variant='secondary' className='apply-button' onClick={contrastVideo}>Apply</Button>
                                    </Col>
                                </Row>
                                <Row className='large-slider-row'>
                                    <Col xs={{ span: 7, offset: 1 }} sm={{ span: 6, offset: 2 }} className='seeker-wrapper'>
                                        <Row className='large-slider-label-row'>
                                            Saturation
                                </Row>
                                        <RangeSlider
                                            variant='light'
                                            min={0.0}
                                            max={3.0}
                                            step={0.1}
                                            value={saturation}
                                            onChange={changeEvent => setSaturation(changeEvent.target.value)}
                                        />
                                    </Col>
                                    <Col xs={{ span: 4 }} sm={{ span: 3 }}>
                                        <Button variant='secondary' className='apply-button' onClick={saturationVideo}>Apply</Button>
                                    </Col>
                                </Row>
                                <Row className='large-slider-row'>
                                    <Col xs={{ span: 7, offset: 1 }} sm={{ span: 6, offset: 2 }} className='seeker-wrapper'>
                                        <Row className='large-slider-label-row'>
                                            Gamma
                                </Row>
                                        <RangeSlider
                                            variant='light'
                                            min={0.1}
                                            max={10.0}
                                            step={0.1}
                                            value={gamma}
                                            onChange={changeEvent => setGamma(changeEvent.target.value)}
                                        />
                                    </Col>
                                    <Col xs={{ span: 4 }} sm={{ span: 3 }}>
                                        <Button variant='secondary' className='apply-button' onClick={gammaVideo}>Apply</Button>
                                    </Col>
                                </Row>
                            </Card.Body>

                        </Card>
                    </Col>
                </Row>
                <Row className='major-row'>
                    <Col xs={{ span: 10, offset: 1 }}>
                        <Row>
                            <Col>
                                <Card bg='dark' text='white'>
                                    <Card.Header className='card-header'>Sharpness</Card.Header>
                                    <Card.Body>
                                        <Row className='slider-label-row'>
                                            <p>Luma X</p>
                                        </Row>
                                        <Row className='slider-row'>
                                            <RangeSlider
                                                variant='light'
                                                min={3.0}
                                                max={19.0}
                                                step={2}
                                                value={lumax}
                                                onChange={changeEvent => setLumax(changeEvent.target.value)}
                                            />
                                        </Row>
                                        <Row className='slider-label-row'>
                                            <p>Luma Y</p>
                                        </Row>
                                        <Row className='slider-row'>
                                            <RangeSlider
                                                variant='light'
                                                min={3.0}
                                                max={7.0}
                                                step={2}
                                                value={lumay}
                                                onChange={changeEvent => setLumay(changeEvent.target.value)}
                                            />
                                        </Row>
                                        <Row className='slider-label-row'>
                                            <p>Luma Amount</p>
                                        </Row>
                                        <Row className='slider-row'>
                                            <RangeSlider
                                                variant='light'
                                                min={-1.5}
                                                max={1.5}
                                                step={0.1}
                                                value={lumaAmount}
                                                onChange={changeEvent => setLumaAmount(changeEvent.target.value)}
                                            />
                                        </Row>
                                        <Row className='slider-label-row'>
                                            <p>Chroma X</p>
                                        </Row>
                                        <Row className='slider-row'>
                                            <RangeSlider
                                                variant='light'
                                                min={3.0}
                                                max={23.0}
                                                step={2}
                                                value={chromax}
                                                onChange={changeEvent => setChromax(changeEvent.target.value)}
                                            />
                                        </Row>
                                        <Row className='slider-label-row'>
                                            <p>Chroma Y</p>
                                        </Row>
                                        <Row className='slider-row'>
                                            <RangeSlider
                                                variant='light'
                                                min={3.0}
                                                max={23.0}
                                                step={2}
                                                value={chromay}
                                                onChange={changeEvent => setChromay(changeEvent.target.value)}
                                            />
                                        </Row>
                                        <Row className='slider-label-row'>
                                            <p>Chroma Amount</p>
                                        </Row>
                                        <Row className='slider-row'>
                                            <RangeSlider
                                                variant='light'
                                                min={-1.5}
                                                max={1.5}
                                                step={0.1}
                                                value={chromaAmount}
                                                onChange={changeEvent => setchromaAmount(changeEvent.target.value)}
                                            />
                                        </Row>
                                        <Row style={{
                                            'justifyContent': 'center',
                                            'textAlign': 'center',

                                            'paddingTop': '3em'
                                        }}>
                                            <Button className='apply-button' variant='secondary' onClick={sharpnessVideo}>Apply</Button>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col>
                                <Card bg='dark' text='white'>
                                    <Card.Header className='card-header'>Blur</Card.Header>
                                    <Card.Body>
                                        <Row className='slider-label-row'>
                                            <p>Luma Radius</p>
                                        </Row>
                                        <Row className='slider-row'>
                                            <RangeSlider
                                                variant='light'
                                                min={0.1}
                                                max={5.0}
                                                step={0.1}
                                                value={lumaRadius}
                                                onChange={changeEvent => setLumaRadius(changeEvent.target.value)}
                                            />
                                        </Row>
                                        <Row className='slider-label-row'>
                                            <p>Luma Strength</p>
                                        </Row>
                                        <Row className='slider-row'>
                                            <RangeSlider
                                                variant='light'
                                                min={-1.0}
                                                max={1.0}
                                                step={0.1}
                                                value={lumaStrength}
                                                onChange={changeEvent => setLumaStrength(changeEvent.target.value)}
                                            />
                                        </Row>
                                        <Row className='slider-label-row'>
                                            <p>Luma Threshold</p>
                                        </Row>
                                        <Row className='slider-row'>
                                            <RangeSlider
                                                variant='light'
                                                min={-30}
                                                max={30}
                                                step={1}
                                                value={lumaThreshold}
                                                onChange={changeEvent => setLumaThreshold(changeEvent.target.value)}
                                            />
                                        </Row>
                                        <Row className='slider-label-row'>
                                            <p>Chroma Radius</p>
                                        </Row>
                                        <Row className='slider-row'>
                                            <RangeSlider
                                                variant='light'
                                                min={0.1}
                                                max={5.0}
                                                step={0.1}
                                                value={chromaRadius}
                                                onChange={changeEvent => setChromaRadius(changeEvent.target.value)}
                                            />
                                        </Row>
                                        <Row className='slider-label-row'>
                                            <p>Chroma Strength</p>
                                        </Row>
                                        <Row className='slider-row'>
                                            <RangeSlider
                                                variant='light'
                                                min={-1.0}
                                                max={1.0}
                                                step={0.1}
                                                value={chromaStrength}
                                                onChange={changeEvent => setChromaStrength(changeEvent.target.value)}
                                            />
                                        </Row>
                                        <Row className='slider-label-row'>
                                            <p>Chroma Threshold</p>
                                        </Row>
                                        <Row className='slider-row'>
                                            <RangeSlider
                                                variant='light'
                                                min={-30}
                                                max={30}
                                                step={1}
                                                value={chromaThreshold}
                                                onChange={changeEvent => setchromaThreshold(changeEvent.target.value)}
                                            />
                                        </Row>

                                        <Row style={{
                                            'justifyContent': 'center',
                                            'textAlign': 'center',
                                            'paddingTop': '3em'
                                        }}>
                                            <Button className='apply-button' variant='secondary' onClick={BlurVideo}>Apply</Button>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col>
                                <Card bg='dark' text='white'>
                                    <Card.Header className='card-header'>COLOR</Card.Header>
                                    <Card.Body>
                                        <Row className='slider-label-row'>
                                            <p>Hue</p>
                                        </Row>
                                        <Row className='slider-row'>
                                            <RangeSlider
                                                variant='light'
                                                min={0.0}
                                                max={360.0}
                                                step={1}
                                                value={hue}
                                                onChange={changeEvent => setHue(changeEvent.target.value)}
                                            />
                                        </Row>
                                        <Row className='slider-label-row'>
                                            <p>Saturation</p>
                                        </Row>
                                        <Row className='slider-row'>
                                            <RangeSlider
                                                variant='light'
                                                min={-10.0}
                                                max={10.0}
                                                step={0.1}
                                                value={hueSaturation}
                                                onChange={changeEvent => setHueSaturation(changeEvent.target.value)}
                                            />
                                        </Row>
                                        <Row className='slider-label-row'>
                                            <p>Brightness</p>
                                        </Row>
                                        <Row className='slider-row'>
                                            <RangeSlider
                                                variant='light'
                                                min={-10.0}
                                                max={10.0}
                                                step={0.1}
                                                value={hueBrightness}
                                                onChange={changeEvent => setHueBrightness(changeEvent.target.value)}
                                            />
                                        </Row>

                                        <Row style={{
                                            'justifyContent': 'center',
                                            'textAlign': 'center',
                                            'paddingTop': '3em'
                                        }}>
                                            <Button variant='secondary' className='apply-button' onClick={colourVideo}>Apply</Button>
                                        </Row>
                                    </Card.Body>
                                </Card>

                            </Col>
                        </Row>
                    </Col>
                </Row>

            </Container>
        </>
    ) :
        (<Container fluid className='loader-container justify-content-center'>

            <Row>
                <Col xs={{ span: 10, offset: 1 }}>
                    <div className="container">
                        <div className="center">
                            <label className='loading-label'>Loading FFmpeg...</label>
                            <div className="loader"></div>
                        </div>
                    </div>

                </Col>
            </Row>

        </Container>
        )

}