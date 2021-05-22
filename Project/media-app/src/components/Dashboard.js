import React, { useState, useEffect, useRef } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { Card, Container, ProgressBar, Row, Col, Button, InputGroup, FormControl, Dropdown, ButtonGroup } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import { storage } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import MyNavbar from './MyNavbar';
import Waveform from './Waveform'
import '../styles/Dashboard.css';
import { useLocation } from "react-router-dom";
import RangeSlider from 'react-bootstrap-range-slider';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo } from "@fortawesome/free-solid-svg-icons";

const ffmpeg = createFFmpeg({
    log: true,
})

export default function Dashboard() {

    const [ffmpegReady, setFfmpegReady] = useState(false);
    const [file, setFile] = useState('./');
    const [originalFile, setOriginalFile] = useState(new Blob([], { type: 'video/mp4' }))
    const [editedVideo, setEditedVideo] = useState('./')
    const [originalAudio, setOriginalAudio] = useState(new Blob([], { type: 'audio/mp3' }))
    const [editedAudio, setEditedAudio] = useState(new Blob([], { type: 'audio/mp3' }))
    const [progress, setProgress] = useState(0);
    const { currentUser } = useAuth();
    const [startTrim, setStartTrim] = useState(0);
    const [endTrim, setEndTrim] = useState(0);
    const [startAudioFadeIn, setStartAudioFadeIn] = useState(0);
    const [endAudioFadeIn, setEndAudioFadeIn] = useState(0);
    const [startAudioFadeOut, setStartAudioFadeOut] = useState(0);
    const [endAudioFadeOut, setEndAudioFadeOut] = useState(0);
    const [uploadName, setUploadName] = useState('');
    const [uploadFile, setUploadFile] = useState(new Blob([], { type: 'video/mp4' }));
    const [played, setPlayed] = useState(0);
    const [player, setPlayer] = useState(null);
    const [duration, setDuration] = useState(0);
    const [brightness, setBrightness] = useState(0);
    const [contrast, setContrast] = useState(1);
    const [saturation, setSaturation] = useState(1);
    const [lumay, setLumay] = useState(5);
    const [chromax, setChromax] = useState(5);
    const [chromaAmount, setchromaAmount] = useState(0);
    const [lumaRadius, setLumaRadius] = useState(2);
    const [lumaStrength, setLumaStrength] = useState(2);
    const [hue, setHue] = useState(0);
    const [gamma, setGamma] = useState(1);
    const [selectedFileName, setSelectedFileName] = useState('Choose File');
    const [echoType, setEchoType] = useState('indoor');
    const [phaserSpeed, setPhaseSpeed] = useState(0.5);
    const [phaserDecay, setPhaseDecay] = useState(0.4);
    const [phaserDelay, setPhaseDelay] = useState(3);
    const [tremoloFrequency, setTremoloFrequency] = useState(3);
    const [tremoloWidth, setTremoloWidth] = useState(0.1);
    const [tremoloOffset, setTremoloOffset] = useState(0);
    const [rendering, setRendering] = useState(false);

    // Allows accessing video URL from Videos component
    const location = useLocation();

    useEffect(() => {
        if (location.state) {
            setFile(location.state.detail); // rSesult: 'some_value'
            setEditedVideo(location.state.detail)
        }

    }, [location]);

    // Util
    const convertSecondsToTime = (seconds) => {
        let hours = Math.floor(seconds / 3600);
        let mins = Math.floor(seconds / 60 % 60);
        let secs = Math.floor(seconds % 60);

        hours < 10 ? hours = `0${hours}` : hours = `${hours}`
        mins < 10 ? mins = `0${mins}` : mins = `${mins}`
        secs < 10 ? secs = `0${secs}` : secs = `${secs}`

        return `${hours}:${mins}:${secs}`
    }

    // Load FFmpeg library
    const loadFfmpeg = async () => {
        await ffmpeg.load();
        setFfmpegReady(true);
    }

    useEffect(() => {
        loadFfmpeg();
    }, [])

    // AUDIO
    const splitAudioVideo = async () => {
        if (ffmpegReady) {
            setRendering(true)
            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'video.mp4', await fetchFile(file));

            // Run command
            await ffmpeg.run('-i', 'video.mp4', '-q:a', '0', '-map', 'a', 'audio.mp3')

            // Read result
            const data = ffmpeg.FS('readFile', 'audio.mp3');

            // Create video URL react-player
            const audioBlob = new Blob([data.buffer], { type: 'audio/mp3' });
            setOriginalAudio(audioBlob);
            setEditedAudio(audioBlob);
            setRendering(false)
        }
    }

    const mergeVideoAudio = async () => {
        if (ffmpegReady) {
            setRendering(true)
            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'video.mp4', await fetchFile(file));
            // Run command
            ffmpeg.FS('writeFile', 'audio.mp3', await fetchFile(editedAudio));

            // Run command
            //ffmpeg -i input_0.mp4 -i input_1.mp4 -c copy -map 0:v:0 -map 1:a:0 -shortest out.mp4
            await ffmpeg.run('-i', 'video.mp4', '-i', 'audio.mp3', '-c', 'copy', '-map', '0:v:0', '-map', '1:a:0', 'videoOut.mp4')

            // Read result
            const data = ffmpeg.FS('readFile', 'videoOut.mp4');

            // Update upload file
            setUploadFile(new Blob([data.buffer], { type: 'video/mp4' }))

            // Create video URL react-player
            const editedVideoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
            setEditedVideo(editedVideoUrl)
            setRendering(false)
        }
    }

    const fadeInAudio = async () => {
        if (ffmpegReady) {
            setRendering(true)
            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'audio.mp3', await fetchFile(editedAudio));

            // Run command
            await ffmpeg.run('-i', 'audio.mp3', '-af', `afade=t=in:st=${startAudioFadeIn}:d=${endAudioFadeIn - startAudioFadeIn}`, 'audioOut.mp3')

            // Read result
            const data = ffmpeg.FS('readFile', 'audioOut.mp3');

            // Create video URL react-player
            const audioBlob = new Blob([data.buffer], { type: 'audio/mp3' });
            setEditedAudio(audioBlob);
            setRendering(false)
        }
    }

    const fadeOutAudio = async () => {
        if (ffmpegReady) {
            setRendering(true)
            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'audio.mp3', await fetchFile(editedAudio));

            // Run command
            await ffmpeg.run('-i', 'audio.mp3', '-af', `afade=t=out:st=${startAudioFadeOut}:d=${endAudioFadeOut - startAudioFadeOut}`, 'audioOut.mp3')

            // Read result
            const data = ffmpeg.FS('readFile', 'audioOut.mp3');

            // Create video URL react-player
            const audioBlob = new Blob([data.buffer], { type: 'audio/mp3' });
            setEditedAudio(audioBlob);
            setRendering(false)
        }

    }

    const deessAudio = async () => {
        if (ffmpegReady) {
            setRendering(true)
            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'audio.mp3', await fetchFile(editedAudio));

            // Run command
            // ./ffmpeg -i ~/audio_source/noisy_speech.wav -filter_complex "deesser=i=1" adeesser_out_voice.wav
            await ffmpeg.run('-i', 'audio.mp3', '-filter_complex', 'deesser=i=1', 'audioOut.mp3')

            // Read result
            const data = ffmpeg.FS('readFile', 'audioOut.mp3');

            // Create video URL react-player
            const audioBlob = new Blob([data.buffer], { type: 'audio/mp3' });
            setEditedAudio(audioBlob);
            setRendering(false)
        }

    }

    const denoiseAudio = async () => {

        if (ffmpegReady) {
            setRendering(true)

            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'audio.mp3', await fetchFile(editedAudio));

            // Run command
            await ffmpeg.run('-i', 'audio.mp3', '-af', `asplit[a][b],[a]adelay=32S|32S[a],[b][a]anlms=order=128:leakage=0.0005:mu=.5:out_mode=o`, 'audioOut.mp3')

            // Read result
            const data = ffmpeg.FS('readFile', 'audioOut.mp3');

            // Create video URL react-player
            const audioBlob = new Blob([data.buffer], { type: 'audio/mp3' });
            setEditedAudio(audioBlob);
            setRendering(false);
        }

    }

    const phaserAudio = async () => {

        if (ffmpegReady) {
            setRendering(true)

            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'audio.mp3', await fetchFile(editedAudio));

            // Run command
            //./ffmpeg -i ~/audio_source/music.wav -filter_complex "aphaser=type=t:speed=2:decay=0.6" aphaser_out_music.wav
            await ffmpeg.run('-i', 'audio.mp3', '-filter_complex', `aphaser=type=t:speed=${phaserSpeed}:decay=${phaserDecay}:delay=${phaserDelay}`, 'audioOut.mp3')

            // Read result
            const data = ffmpeg.FS('readFile', 'audioOut.mp3');

            // Create video URL react-player
            const audioBlob = new Blob([data.buffer], { type: 'audio/mp3' });
            setEditedAudio(audioBlob);
            setRendering(false);
        }

    }

    const tremoloAudio = async () => {

        if (ffmpegReady) {
            setRendering(true)

            let offsetDirection = 'offset_r'
            if (tremoloOffset < 0) {
                setTremoloOffset(Math.abs(tremoloOffset))
                offsetDirection = 'offset_l'
            }

            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'audio.mp3', await fetchFile(editedAudio));

            // Run command
            await ffmpeg.run('-i', 'audio.mp3', '-filter_complex', `apulsator=mode=sine:hz=${tremoloFrequency}:width=${tremoloWidth}:${offsetDirection}=${tremoloOffset}`, 'audioOut.mp3')

            // Read result
            const data = ffmpeg.FS('readFile', 'audioOut.mp3');

            // Create video URL react-player
            const audioBlob = new Blob([data.buffer], { type: 'audio/mp3' });
            setEditedAudio(audioBlob);
            setRendering(false);
        }

    }

    const reverseAudio = async () => {

        if (ffmpegReady) {
            setRendering(true)

            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'audio.mp3', await fetchFile(editedAudio));

            // Run command
            ///ffmpeg -i ~/audio_source/noisy_speech.wav -filter_complex "areverse" areverse_out_voice.wav
            await ffmpeg.run('-i', 'audio.mp3', '-filter_complex' `areverse`, 'audioOut.mp3')

            // Read result
            const data = ffmpeg.FS('readFile', 'audioOut.mp3');

            // Create video URL react-player
            const audioBlob = new Blob([data.buffer], { type: 'audio/mp3' });
            setEditedAudio(audioBlob);
            setRendering(false);
        }
    }

    const echoAudio = async () => {
        if (ffmpegReady) {
            setRendering(true)

            let indoorEchoParams = '0.8:0.9:40|50|70:0.4|0.3|0.2'
            let mountainEchoParams = '0.8:0.9:500|1000:0.2|0.1'
            let echoParams = ''

            echoType === 'indoor' ? echoParams = indoorEchoParams : echoParams = mountainEchoParams

            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'audio.mp3', await fetchFile(editedAudio));

            // Run command
            // /ffmpeg -i ./arnn_out.wav -filter_complex "aecho=0.8:0.9:40|50|70:0.4|0.3|0.2" echo_indoor_out.wav

            await ffmpeg.run('-i', 'audio.mp3', '-filter_complex', `aecho=${echoParams}`, 'audioOut.mp3')

            // Read result
            const data = ffmpeg.FS('readFile', 'audioOut.mp3');

            // Create video URL react-player
            const audioBlob = new Blob([data.buffer], { type: 'audio/mp3' });
            setEditedAudio(audioBlob);
            setRendering(false);
        }
    }

    const resetAudio = () => {
        setEditedAudio(originalAudio)

    }

    // VIDEO
    const trimVideo = async () => {
        if (ffmpegReady) {
            setRendering(true)
            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(editedVideo));

            // Run command

            //ffmpeg -ss 00:08:00 -i Video.mp4 -ss 00:01:00 -t 00:01:00 -c copy VideoClip.mp4
            //The first -ss seeks fast to (approximately) 8min0sec, and then the second -ss seeks accurately to 9min0sec, and the -t 00:01:00 takes out a 1min0sec clip.

            await ffmpeg.run('-i', 'test.mp4', '-ss', startTrim, '-t', `${endTrim - startTrim}`, 'testOut.mp4');

            //await ffmpeg.run('-i', 'test.mp4', '-ss', startTrim, '-to', endTrim, '-c:v', 'copy', '-c:a', 'copy', 'testOut.mp4');

            // Read result
            const data = ffmpeg.FS('readFile', 'testOut.mp4');

            // Update upload file
            setUploadFile(new Blob([data.buffer], { type: 'video/mp4' }))

            // Create video URL react-player
            const editedVideoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
            setEditedVideo(editedVideoUrl)
            setRendering(false);
        }

    }

    const brightnessVideo = async () => {
        if (ffmpegReady) {
            setRendering(true)
            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(editedVideo));

            // Run command
            await ffmpeg.run('-i', 'test.mp4', '-vf', `eq=brightness=${brightness}`, '-c:a', 'copy', 'testOut.mp4');

            // Read result
            const data = ffmpeg.FS('readFile', 'testOut.mp4');

            // Update upload file
            setUploadFile(new Blob([data.buffer], { type: 'video/mp4' }))

            // Create video URL react-player
            const editedVideoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
            setEditedVideo(editedVideoUrl)
            setRendering(false);
        }

    }

    const contrastVideo = async () => {
        if (ffmpegReady) {
            setRendering(true)
            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(editedVideo));

            // Run command
            await ffmpeg.run('-i', 'test.mp4', '-vf', `eq=contrast=${contrast}`, '-c:a', 'copy', 'testOut.mp4');

            // Read result
            const data = ffmpeg.FS('readFile', 'testOut.mp4');

            // Update upload file
            setUploadFile(new Blob([data.buffer], { type: 'video/mp4' }))

            // Create video URL react-player
            const editedVideoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
            setEditedVideo(editedVideoUrl)
            setRendering(false);
        }

    }

    const gammaVideo = async () => {
        if (ffmpegReady) {
            setRendering(true)
            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(editedVideo));

            // Run command
            await ffmpeg.run('-i', 'test.mp4', '-vf', `eq=gamma=${gamma}`, '-c:a', 'copy', 'testOut.mp4');

            // Read result
            const data = ffmpeg.FS('readFile', 'testOut.mp4');

            // Update upload file
            setUploadFile(new Blob([data.buffer], { type: 'video/mp4' }))

            // Create video URL react-player
            const editedVideoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
            setEditedVideo(editedVideoUrl)
            setRendering(false);
        }

    }

    const hueVideo = async () => {
        if (ffmpegReady) {
            setRendering(true)
            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(uploadFile));

            // Run command
            await ffmpeg.run('-i', 'test.mp4', '-vf', `hue=h=${hue}`, '-c:a', 'copy', 'testOut.mp4');

            // Read result
            const data = ffmpeg.FS('readFile', 'testOut.mp4');

            // Update upload file
            setUploadFile(new Blob([data.buffer], { type: 'video/mp4' }))

            // Create video URL react-player
            const editedVideoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
            setEditedVideo(editedVideoUrl)
            setRendering(false);
        }

    }

    const saturationVideo = async () => {
        if (ffmpegReady) {
            setRendering(true)
            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(editedVideo));

            // Run command
            await ffmpeg.run('-i', 'test.mp4', '-vf', `eq=saturation=${saturation}`, '-c:a', 'copy', 'testOut.mp4');

            // Read result
            const data = ffmpeg.FS('readFile', 'testOut.mp4');

            // Update upload file
            setUploadFile(new Blob([data.buffer], { type: 'video/mp4' }))

            // Create video URL react-player
            const editedVideoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
            setEditedVideo(editedVideoUrl)
            setRendering(false);
        }

    }

    const sharpnessVideo = async () => {
        if (ffmpegReady) {
            setRendering(true)
            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(editedVideo));

            // Run command
            await ffmpeg.run('-i', 'test.mp4', '-vf', `unsharp=${lumay}:${lumay}:${chromaAmount}:${chromax}:${chromax}:${chromaAmount}`, '-c:a', 'copy', 'testOut.mp4');

            // Read result
            const data = ffmpeg.FS('readFile', 'testOut.mp4');

            // Update upload file
            setUploadFile(new Blob([data.buffer], { type: 'video/mp4' }))

            // Create video URL react-player
            const editedVideoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
            setEditedVideo(editedVideoUrl)
            setRendering(false);
        }

    }

    const blurVideo = async () => {
        if (ffmpegReady) {
            setRendering(true)
            // Write file to memory so webassemble can access it
            ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(editedVideo));

            // Run command
            await ffmpeg.run('-i', 'test.mp4', '-vf', `boxblur=${lumaRadius}:${lumaStrength}`, '-c:a', 'copy', 'testOut.mp4');

            // Read result
            const data = ffmpeg.FS('readFile', 'testOut.mp4');

            // Update upload file
            setUploadFile(new Blob([data.buffer], { type: 'video/mp4' }))

            // Create video URL react-player
            const editedVideoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
            setEditedVideo(editedVideoUrl)
            setRendering(false);
        }

    }

    const resetVideo = () => {
        setUploadFile(originalFile)
        setEditedVideo(URL.createObjectURL(originalFile))
    }

    // Handlers
    const handleSelectFile = (e) => {
        setSelectedFileName(inputRef.current.files[0].name)
        setFile(URL.createObjectURL(e.target.files?.item(0)));
        setOriginalFile(e.target.files?.item(0))
        setUploadFile(e.target.files?.item(0));
        setEditedVideo(URL.createObjectURL(e.target.files?.item(0)))
    }

    const handleLoadedVideo = () => {
        setDuration(player.getDuration())
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

    const ref = myPlayer => {
        setPlayer(myPlayer)
    }

    const inputRef = useRef();

    return ffmpegReady ? (
        <>
            <MyNavbar />
            <Container fluid className='main-container justify-content-center'>
                {
                    rendering ? (
                        <Container fluid className='loader-container justify-content-center'>
                            <Row className='rendering-loader'>
                                <Col xs={{ span: 10, offset: 1 }}>
                                    <div className="container">
                                        <div className="center">
                                            <p className='loading loading-label'>Rendering</p>
                                            <div className="loader"></div>
                                        </div>
                                    </div>

                                </Col>
                            </Row>
                        </Container>
                    )
                        :
                        <div></div>
                }

                <Row className='major-row'>
                    <Col sm={{ span: 10, offset: 1 }}>
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
                    <Col sm={{ span: 10, offset: 1 }}>
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
                    <Col sm={{ span: 10, offset: 1 }}>
                        <Row>
                            <Col xs={{ span: 12 }} sm={{ span: 6 }}>
                                <Card bg='dark' text='white'>
                                    <Card.Header className='card-header'>
                                        <Row style={{ justifyContent: 'center', textAlign: 'center' }}>
                                            <Col>
                                                Original
                                            </Col>
                                            <Col>
                                                <Button style={{ opacity: 0 }} title='Reset' variant='outline-light' onClick={() => { resetVideo() }}>
                                                    <FontAwesomeIcon icon={faUndo} />
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card.Header>
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
                                    <Card.Header className='card-header'>
                                        <Row style={{ justifyContent: 'center', textAlign: 'center' }}>
                                            <Col>
                                                Preview
                                            </Col>
                                            <Col>
                                                <Button title='Reset' variant='outline-light' onClick={() => { resetVideo() }}>
                                                    <FontAwesomeIcon icon={faUndo} />
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card.Header>
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
                    <Col sm={{ span: 10, offset: 1 }}>
                        <Card style={{ textAlign: 'center' }} bg='dark' text='white'>
                            <Card.Header className='card-header'>Video</Card.Header>
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
                                            <FormControl

                                                placeholder="End time in seconds..."
                                                aria-label="End Trim"
                                                aria-describedby="trim-end-input"
                                                onChange={e => setEndTrim(e.target.value)}
                                            />
                                        </InputGroup>
                                    </Col>
                                    <Col xs={{ span: 4 }} md={{ span: 2 }}>
                                        <Button variant='secondary' className='trim-button' onClick={trimVideo}>Trim</Button>
                                    </Col>
                                </Row>
                                <Row style={{ padding: '1em 0 1em 0' }}>
                                    <Col xs={{ span: 12 }} lg={{ span: 10, offset: 1 }}>
                                        <Card bg='dark' text='white'>
                                            <Card.Header className='card-header-custom'>
                                                Image Adjustments
                                        </Card.Header>
                                            <Card.Body className='card-custom'>
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
                                                            Hue
</Row>
                                                        <RangeSlider
                                                            variant='light'
                                                            min={0}
                                                            max={360}
                                                            step={0.1}
                                                            value={hue}
                                                            onChange={changeEvent => setHue(changeEvent.target.value)}
                                                        />
                                                    </Col>
                                                    <Col xs={{ span: 4 }} sm={{ span: 3 }}>
                                                        <Button variant='secondary' className='apply-button' onClick={hueVideo}>Apply</Button>
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
                                <Row style={{ padding: '1em 0 1em 0' }}>
                                    <Col xs={{ span: 12 }} lg={{ span: 10, offset: 1 }}>
                                        <Card bg='dark' text='white'>
                                            <Card.Header className='card-header-custom'>
                                                Video FX
                                        </Card.Header>
                                            <Card.Body className='card-custom'>
                                                <Col xs={{ span: 12 }} lg={{ span: 8, offset: 2 }}>
                                                    <Dropdown className='audio-fx-dropdown' as={ButtonGroup}>
                                                        <Button onClick={() => { sharpnessVideo() }} variant="secondary">Sharpen</Button>

                                                        <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic" />

                                                        <Dropdown.Menu className='dropdown-menu-custom'>
                                                            <Dropdown.Header>Sharpen Settings</Dropdown.Header>
                                                            <Dropdown.Item className='dropdown-item-custom' as='button'>
                                                                <Row>
                                                                    <Col>Luma</Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col>
                                                                        <RangeSlider
                                                                            variant='light'
                                                                            min={3.0}
                                                                            max={7.0}
                                                                            step={2}
                                                                            value={lumay}
                                                                            onChange={changeEvent => setLumay(changeEvent.target.value)}
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                            </Dropdown.Item>
                                                            <Dropdown.Item className='dropdown-item-custom' as='button'>
                                                                <Row>
                                                                    <Col>Chroma </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col>
                                                                        <RangeSlider
                                                                            variant='light'
                                                                            min={3.0}
                                                                            max={13.0}
                                                                            step={2}
                                                                            value={chromax}
                                                                            onChange={changeEvent => setChromax(changeEvent.target.value)}
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                            </Dropdown.Item>
                                                            <Dropdown.Item className='dropdown-item-custom' as='button'>
                                                                <Row>
                                                                    <Col>Amount</Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col>
                                                                        <RangeSlider
                                                                            variant='light'
                                                                            min={-1.5}
                                                                            max={1.5}
                                                                            step={0.1}
                                                                            value={chromaAmount}
                                                                            onChange={changeEvent => setchromaAmount(changeEvent.target.value)}
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                            </Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </Col>
                                                <Col xs={{ span: 12 }} lg={{ span: 8, offset: 2 }}>
                                                    <Dropdown className='audio-fx-dropdown' as={ButtonGroup}>
                                                        <Button onClick={() => { blurVideo() }} variant="secondary">Blur</Button>

                                                        <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic" />

                                                        <Dropdown.Menu className='dropdown-menu-custom'>
                                                            <Dropdown.Header>Blur Settings</Dropdown.Header>
                                                            <Dropdown.Item className='dropdown-item-custom' as='button'>
                                                                <Row>
                                                                    <Col>Radius</Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col>
                                                                        <RangeSlider
                                                                            variant='light'
                                                                            min={0}
                                                                            max={100}
                                                                            step={1}
                                                                            value={lumaRadius}
                                                                            onChange={changeEvent => setLumaRadius(changeEvent.target.value)}
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                            </Dropdown.Item>
                                                            <Dropdown.Item className='dropdown-item-custom' as='button'>
                                                                <Row>
                                                                    <Col>Power</Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col>
                                                                        <RangeSlider
                                                                            variant='light'
                                                                            min={0}
                                                                            max={100}
                                                                            step={1}
                                                                            value={lumaStrength}
                                                                            onChange={changeEvent => setLumaStrength(changeEvent.target.value)}
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                            </Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </Col>
                                            </Card.Body>
                                        </Card>

                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className='major-row'>
                    <Col sm={{ span: 10, offset: 1 }}>
                        <Card bg='dark' text='white'>
                            <Card.Header className='card-header'>Audio</Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <Button variant='secondary' onClick={splitAudioVideo} className='apply-button'>Split Video/Audio Tracks</Button>
                                    </Col>
                                </Row>
                                <Row className='justify-content-center'>
                                    <Col className='justify-content-center audio-waveform-col'>
                                        <Waveform blob={editedAudio}></Waveform>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Button title='Reset' variant='outline-light' style={{ marginBottom: '2em' }} onClick={() => { resetAudio() }}>
                                            <FontAwesomeIcon icon={faUndo} />
                                        </Button>

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
                                                }}>
                                                    <Col xs={{ span: 10 }} md={{ span: 5 }}>
                                                        <InputGroup className='input-box fade-input-box fill'>
                                                            <FormControl
                                                                placeholder="Start fade-in"
                                                                aria-label="Start Fade-In"
                                                                aria-describedby="fade-in-start-input"
                                                                onChange={e => setStartAudioFadeIn(e.target.value)}
                                                            />
                                                        </InputGroup>
                                                    </Col>
                                                    <Col xs={{ span: 10 }} md={{ span: 5 }}>
                                                        <InputGroup className='input-box fade-input-box'>
                                                            <FormControl
                                                                placeholder="End fade-in"
                                                                aria-label="End fade-in"
                                                                aria-describedby="fade-in-end-input"
                                                                onChange={e => setEndAudioFadeIn(e.target.value)}
                                                            />
                                                        </InputGroup>
                                                    </Col>
                                                    <Col>
                                                        <Button variant='secondary' className='apply-button' onClick={fadeInAudio}>Apply</Button>
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
                                                }}>
                                                    <Col xs={{ span: 10 }} md={{ span: 5 }}>
                                                        <InputGroup className='input-box fade-input-box'>
                                                            <FormControl
                                                                placeholder="Start fade-out"
                                                                aria-label="Start Fade-out"
                                                                aria-describedby="fade-out-start-input"
                                                                onChange={e => setStartAudioFadeOut(e.target.value)}
                                                            />
                                                        </InputGroup>
                                                    </Col>
                                                    <Col xs={{ span: 10 }} md={{ span: 5 }}>
                                                        <InputGroup className='input-box fade-input-box'>
                                                            <FormControl
                                                                placeholder="End fade-out"
                                                                aria-label="End fade-out"
                                                                aria-describedby="fade-out-end-input"
                                                                onChange={e => setEndAudioFadeOut(e.target.value)}
                                                            />
                                                        </InputGroup>
                                                    </Col>
                                                    <Col>
                                                        <Button variant='secondary' className='apply-button' onClick={fadeOutAudio}>Apply</Button>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card bg='dark' text='white'>
                                            <Card.Header className='card-header card-header-custom'>Audio FX</Card.Header>
                                            <Card.Body className='card-custom'>
                                                <Row>
                                                    <Col xs={{ span: 12 }} lg={{ span: 6 }}>
                                                        <Button className='audio-fx-button' variant='secondary' onClick={deessAudio}>Deess</Button>
                                                    </Col>
                                                    <Col xs={{ span: 12 }} lg={{ span: 6 }}>
                                                        <Button className='audio-fx-button' variant='secondary' onClick={denoiseAudio}>Denoise</Button>
                                                    </Col>
                                                    <Col xs={{ span: 12 }} lg={{ span: 6 }}>
                                                        <Button className='audio-fx-button' variant='secondary' onClick={reverseAudio}>Reverse</Button>
                                                    </Col>

                                                    <Col xs={{ span: 12 }} lg={{ span: 6 }}>
                                                        <Dropdown className='audio-fx-dropdown' as={ButtonGroup}>
                                                            <Button onClick={() => { tremoloAudio() }} variant="secondary">Tremolo</Button>

                                                            <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic" />

                                                            <Dropdown.Menu className='dropdown-menu-custom'>
                                                                <Dropdown.Header>Tremolo Settings</Dropdown.Header>
                                                                <Dropdown.Item className='dropdown-item-custom' as='button'>
                                                                    <Row>
                                                                        <Col>Frequency (Hz)</Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col>
                                                                            <RangeSlider
                                                                                variant='light'
                                                                                min={0.01}
                                                                                max={100}
                                                                                step={0.1}
                                                                                value={tremoloFrequency}
                                                                                onChange={changeEvent => setTremoloFrequency(changeEvent.target.value)}
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </Dropdown.Item>
                                                                <Dropdown.Item className='dropdown-item-custom' as='button'>
                                                                    <Row>
                                                                        <Col>Width</Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col>
                                                                            <RangeSlider
                                                                                variant='light'
                                                                                min={0}
                                                                                max={2}
                                                                                step={0.1}
                                                                                value={tremoloWidth}
                                                                                onChange={changeEvent => setTremoloWidth(changeEvent.target.value)}
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </Dropdown.Item>
                                                                <Dropdown.Item className='dropdown-item-custom' as='button'>
                                                                    <Row>
                                                                        <Col>Offset</Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col>
                                                                            <RangeSlider
                                                                                variant='light'
                                                                                min={-1}
                                                                                max={1}
                                                                                step={0.01}
                                                                                value={tremoloOffset}
                                                                                onChange={changeEvent => {

                                                                                    setTremoloOffset(changeEvent.target.value)
                                                                                }}
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </Col>
                                                    <Col xs={{ span: 12 }} lg={{ span: 6 }}>
                                                        <Dropdown className='audio-fx-dropdown' as={ButtonGroup}>
                                                            <Button onClick={() => { phaserAudio() }} variant="secondary">Phaser</Button>

                                                            <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic" />

                                                            <Dropdown.Menu className='dropdown-menu-custom'>
                                                                <Dropdown.Header>Phaser Settings</Dropdown.Header>
                                                                <Dropdown.Item className='dropdown-item-custom' as='button'>
                                                                    <Row>
                                                                        <Col>Speed (Hz)</Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col>
                                                                            <RangeSlider
                                                                                variant='light'
                                                                                min={0.5}
                                                                                max={100}
                                                                                step={0.1}
                                                                                value={phaserSpeed}
                                                                                onChange={changeEvent => setPhaseSpeed(changeEvent.target.value)}
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </Dropdown.Item>
                                                                <Dropdown.Item className='dropdown-item-custom' as='button'>
                                                                    <Row>
                                                                        <Col>Decay</Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col>
                                                                            <RangeSlider
                                                                                variant='light'
                                                                                min={0}
                                                                                max={1}
                                                                                step={0.05}
                                                                                value={phaserDecay}
                                                                                onChange={changeEvent => setPhaseDecay(changeEvent.target.value)}
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </Dropdown.Item>
                                                                <Dropdown.Item className='dropdown-item-custom' as='button'>
                                                                    <Row>
                                                                        <Col>Delay</Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col>
                                                                            <RangeSlider
                                                                                variant='light'
                                                                                min={0.5}
                                                                                max={5000}
                                                                                step={5}
                                                                                value={phaserDelay}
                                                                                onChange={changeEvent => {
                                                                                    setPhaseDelay(changeEvent.target.value)
                                                                                }}
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </Col>
                                                    <Col xs={{ span: 12 }} lg={{ span: 6 }}>
                                                        <Dropdown className='audio-fx-dropdown' as={ButtonGroup}>
                                                            <Button onClick={echoAudio} variant="secondary">Echo</Button>

                                                            <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic" />

                                                            <Dropdown.Menu className='dropdown-menu-custom'>
                                                                <Dropdown.Header>Echo Type</Dropdown.Header>
                                                                <Dropdown.Item onClick={() => { setEchoType('indoor') }}>Indoors</Dropdown.Item>
                                                                <Dropdown.Item onClick={() => { setEchoType('mountain') }}>Mountains</Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>

                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <Button variant='secondary' onClick={mergeVideoAudio} className='apply-button'>Merge Video/Audio Tracks</Button>
                                    </Col>
                                </Row>

                            </Card.Body>
                        </Card>
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
                            <label className='loading-label loading'>Loading FFmpeg</label>
                            <div className="loader"></div>
                        </div>
                    </div>

                </Col>
            </Row>

        </Container>
        )

}