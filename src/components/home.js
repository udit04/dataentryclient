import React, {Component} from 'react'
import {Container, Col, Row, Button, Card} from 'react-bootstrap'
import LocalStorageService from '../LocalStorageService'
export default class Home extends Component {

    constructor(props){
        super(props)
    }

    componentDidMount = () => {
        var data=LocalStorageService.getAccessToken()
        //var data=JSON.parse(localStorage.getItem("access_token"))
        console.log(data)
        if (!data){
            this.setState({login:false})
            this.props.history.push("/login")
        }
        else{ 
             this.setState({token:data.payload.token, email:data.payload.email, _id:data.payload._id, login:data.login})
        }
    }

    handleClick = (name) => {
            this.props.history.push(`${this.props.location.pathname}/${name}`)
    }

    render() {
        return(
           
            <Container >
                <div style={{display:'flex', padding:20, justifyContent:'space-between'}}>
 <h1 style={{display:'inline'}}>Home</h1>
 <section><Button onClick= { (e) =>{ e.preventDefault(); localStorage.clear();this.props.history.push("/login")}} variant="danger"> Logout   </Button>  
</section>
 

                </div>
                       <Row >
                    <Col sm={12}  xs={12} md={6} lg={6}>
                    <Card border="dark" onClick={(e) => {e.preventDefault(); this.handleClick("entry")}} style={{ display: 'flex', alignItems:'center', justifyContent:'center', justifyItems:'center', backgroundColor:'coral', width:'100%', minHeight:'50vh'}}>

                    <h1>Data Entry</h1>


                    </Card>
                    </Col>
                    

                    <Col sm={12}  xs={12} md={6} lg={6}>
                    <Card border="dark" onClick={(e) => {e.preventDefault(); this.handleClick("process")}} style={{ display: 'flex', alignItems:'center', justifyContent:'center', justifyItems:'center', backgroundColor:'coral', width:'100%', minHeight:'50vh'}}>

                    <h1>Data Process</h1>


                    </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}