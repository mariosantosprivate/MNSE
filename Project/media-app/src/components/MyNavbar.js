import React, { useState } from 'react'
import { Navbar, Nav, Alert } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/MyNavbar.css'
export default function MyNavbar() {

    const [error, setError] = useState('')
    const { currentUser, logout } = useAuth()
    const history = useHistory()

    async function handleLogout() {
        setError('')
        try {
            await logout()
            history.push('/login')
        } catch {
            setError('Failed to log out')
        }
    }

    return (
        <Navbar bg="light" expand="lg">
            {error && <Alert variant='danger'>{error}</Alert>}
            <Navbar.Brand href="/">{currentUser.email}</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto my-navbar">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/update-profile">Profile</Nav.Link>
                    <Nav.Link href="/my-videos">Videos</Nav.Link>
                    
                    <Nav.Link href="/" onClick={handleLogout}>Log Out</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}
