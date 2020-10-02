import React, {Component} from 'react'
import LocalStorageService from '../LocalStorageService'
import {Button, Container, Table, Col, Row, Tab, Tabs} from 'react-bootstrap'
import axios from 'axios'
import endpoint from '../config'
import Loader from './loader'
import TableRows from './tableRows.js'
import '../interceptor'
export default class Process extends Component{
    constructor(props){
        super(props)
        this.state={
            loading:true
        }
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
        this.fetchData("unprocessed")
    }



        fetchData = (type) => {
            this.setState({loading:true}, () => {

        axios.get(endpoint.host+`/getUnprocessedData/${type}`).
            then((response) => {
                console.log(response.data)
                this.setState({data:response.data, loading:false})
            }).catch((err) =>{
                console.log(err)
            })

            })

        }

      

        drawTable = (source) =>{

            console.log(this.state.data)
            if(this.state.data.length>0){
                return(

                    <Table  responsive striped bordered hover>
                        <thead>
                            <tr>
                            <th>#</th>
                            <th>Customer </th>
                            <th>Product </th>
                            <th>Supplier</th>
                            <th>Type</th>
                            <th>Grade</th>
                            <th>Unit</th>
                            <th>Quantity</th>
                            <th>PO</th>
                            <th>Quotation</th>
                            <th>Date</th>
                            <th>Process</th>
                            </tr>
                        </thead>

                      <tbody>



                      {this.state.data.map( (value, ind) => {
                        return  <TableRows source={source} showProcessButton={true} fetchData={this.fetchData} key={ind} value={value} ind={ind}/>
                      })}
                      </tbody>

                    </Table>

                )
            } else{
                return(
                <div style={{ display: 'flex', textAlign:'center', alignItems:'center', justifyContent:'center', width:'100%', minHeight:'50vh'}}>
                   
                   
                   
                    <div style={{display:'block'}}>
                    <div style={{ display: 'flex', alignItems:'center', justifyContent:'center'}}>
                    <h1>&#128516;</h1>
                   </div>
                         <h1> No Unprocessed Data Here!</h1>
                    </div>
                   
                    </div>)
                
            }
    
         
        }


    render(){
        
return(
            <Container>

<div>

<Row>
    <Col  xs={12} sm={12} md={6} lg={6}>
    <h1 style={{display:'inline'}}>Process</h1>
 
    </Col>
    <Col  xs={12} sm={12} md={6} lg={6}>
   
    <div style={{display:'flex', float:'right',   padding:20, justifyContent:'space-between'}}>
 <section>
 <Button style={{marginRight:10}}  onClick= { (e) =>{ e.preventDefault(); this.props.history.goBack()}} variant="info"> Back   </Button>  

 <Button variant="success" style={{marginRight:10}} onClick={(e) => {e.preventDefault(); this.props.history.push(`${this.props.location.pathname}/dashboard`)}}>Dashboard</Button>
 
 <Button onClick= { (e) =>{ e.preventDefault(); localStorage.clear();this.props.history.push("/login")}} variant="danger"> Logout   </Button>  


 </section>

 </div>
    
    </Col>
</Row>

<Tabs defaultActiveKey="unprocessed" id="uncontrolled-tab-example" onSelect={(key) => this.fetchData(key)}>
  <Tab eventKey="unprocessed" title="Unprocessed" style={{paddingTop:20}}>
   
   {this.state.loading?<Loader />:this.drawTable("unprocessed")}

  </Tab>
  <Tab eventKey="quotation" title="Quotation Sent" style={{paddingTop:20}}>
  {this.state.loading?<Loader />:this.drawTable("quotation")}
  </Tab>
  
</Tabs>
    

                </div>
            </Container>


        )

        }

    
}