import React, { useState } from 'react'
import { Container } from 'react-bootstrap'
import MyNavbar from './MyNavbar'
import '../styles/MyVideos.css'
import { storage } from '../firebase'
import { useAuth } from '../contexts/AuthContext'


export default function MyVideos() {

    const { currentUser } = useAuth()

    // Create a reference under which you want to list
    var listRef = storage.ref(`user/${currentUser.uid}`)

    // Find all the prefixes and items.
    listRef.listAll()
        .then((res) => {
            res.prefixes.forEach((folderRef) => {
                // All the prefixes under listRef.
                // You may call listAll() recursively on them.
                console.log(folderRef)
            });
            res.items.forEach((itemRef) => {
                console.log(itemRef)
                // All the items under listRef.
            });
        }).catch((error) => {
            // Uh-oh, an error occurred!
        });

    return (
        <>
            <MyNavbar />
            <Container fluid className='main-container justify-content-center text-center mt-2'>

            </Container>
        </>
    )
}
