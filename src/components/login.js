import React, { Component } from 'react'
import {Container, Col, Row, Button} from 'react-bootstrap'
import axios from 'axios'
import endpoint from '../config'
import LocalStorageService from '../LocalStorageService'

export default class login extends Component {
    constructor(props){
        super(props)
    }

    handleChange = (event) =>{
        this.setState({[event.target.name]:event.target.value})
    }

    handleSubmit = (e) => {
        e.preventDefault()
        
        axios.post(endpoint.host+"/login", this.state).
        then((response) => {
            console.log(response)
            console.log(response.data)

            var loggedInData=response.data
            loggedInData.login=true
            LocalStorageService.setToken(JSON.stringify(loggedInData))
            this.props.history.push("/home")
        }).catch ((err)=>
        console.log(err))
    }

    render(){
        return(
            <Container style={{textAlign:'center', padding:40}}>
                <form onSubmit={this.handleSubmit}>
                <Row>
                <span>Email</span>
                <input type="text" name="email" placeholder="Email" onChange={this.handleChange}></input>
                </Row>

                <Row>
                <span>Password</span>
                <input type="password" name="password" onChange={this.handleChange} placeholder="password" />
                
              
                   </Row>
                   <br/>
                   <Row>
                   <Button block variant="warning" type="submit">Log In</Button>
                   </Row>
                  
           
                </form>
               
            </Container>
        )
    }
}