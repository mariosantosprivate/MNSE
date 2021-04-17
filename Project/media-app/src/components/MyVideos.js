import React, {useState} from 'react'
import { Container } from 'react-bootstrap'
import MyNavbar from './MyNavbar'
import '../styles/MyVideos.css'
import {storage } from '../firebase'
import { useAuth } from '../contexts/AuthContext'

export default function MyVideos() {

    return (
        <>
            <MyNavbar/>
            <Container fluid className='main-container justify-content-center text-center mt-2'>
                
            </Container>
        </>
    )
}
