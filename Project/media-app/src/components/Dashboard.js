import React from 'react'
import { Card, Container } from 'react-bootstrap'
import MyNavbar from './MyNavbar'
import '../styles/Dashboard.css'
export default function Dashboard() {

    return (
        <>
            <MyNavbar/>
            <Container fluid className='main-container justify-content-center'>
                <div  className='text-center mt-2'>
                    <Card>
                        <Card.Body>
                            <h2 className='text-center mb-4'>Dashboard</h2>                            
                        </Card.Body>
                    </Card>
                </div>
            </Container>
        </>
    )
}
