import React, {Component} from 'react'
import {Container, Button, Row, Col} from 'react-bootstrap'
import axios from 'axios'
import endpoint from '../config'
import '../interceptor'
import LocalStorageService from '../LocalStorageService'
import Loader from './loader'
import  { createFilter } from 'react-select';
import CreatableSelect from 'react-select/creatable';
export default class Entry extends Component{

    constructor(props){
        super(props)
        this.state={
            type:"domestic",
            loading:true,
            showSuccessDiv:false,
            date:new Date().toISOString().slice(0,10).split('/').join('-')

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
    this.getOptions()
}

    getOptions = () => {
        this.setState({loading:true})
        axios.get(endpoint.host+"/getAllOptions").
        then((response) => {
            console.log(response.data)
            this.setState({options:response.data, allSuppliers:response.data.supplierNames, loading:false})
        }).catch((err) => console.log(err))

    }

    handleChange = (newValue, action) => {
        
         if(action && (action.name=="product" && (action.action==='clear'))){

            var options=this.state.options
            var allSuppliers=this.state.allSuppliers
            console.log(allSuppliers)
            options.supplierNames=allSuppliers
            this.setState({options})
        }
          else  if(action && (action.name=="product" && (action.action==='create-option' || action.action==='select-option'))){
                console.log(newValue, action.name, newValue._id); 
               if(newValue._id){
                axios.post(endpoint.host+"/suppliersForProduct", {product_id:newValue._id}).
                then((response) => {
                    console.log(response.data)
                var options=this.state.options
                var allSuppliers=options.supplierNames
                options.supplierNames=response.data
                this.setState({options})
                }).
                catch((err) =>{console.log(err)})
                
               }else{
                var options=this.state.options
                var allSuppliers=this.state.allSuppliers
                options.supplierNames=allSuppliers
                this.setState({options})
               }
               
               this.setState({[action.name]:newValue.value})

            }
        
            else if(action && (action.action==='create-option' || action.action==='select-option')){
               // console.log(newValue, action.name); 
               console.log(action)
                this.setState({[action.name]:newValue.value})
            }
            
            else if(! action){
                this.setState({[newValue.target.name]:newValue.target.value})

            }
        

      };
      
    handleTypeChange = (event) => {
        
        this.setState({type:event.target.name})
    }

    handleSubmit = (event) =>{
            event.preventDefault()
        console.log(this.state)
        localStorage.removeItem("customer")
        axios.post(endpoint.host+"/dataentry", this.state).
        then((response) => {
            console.log(response.data)
            console.log("hello")

            this.setState({showSuccessDiv:true})
            
        }).
        catch((err) => {
            console.log(err)
        })
    }


    handleSaveAndContinue = (e) => {
        e.preventDefault()
        localStorage.setItem("customer", this.state.name)

        axios.post(endpoint.host+"/dataentry", this.state).
        then((response) => {
            console.log(response.data)
            console.log("hello")

            this.setState({showSuccessDiv:true})
            this.getOptions()
        }).
        catch((err) => {
            console.log(err)
        })
        
    }

    successOverlay = () => {
        const style={
            zIndex:100,
            width:'100%',
            height:'100vh',
            top:0,
            left:0,
            position:'fixed',
            background: 'rgba(0,0,0,0.7)',
            //opacity:0.6,
            display:'flex',
            justifyContent:'center',
            alignItems:'center'

        }
        var successCard={

            zIndex:100,
            width:'80%',
            height:'40vh',
            margin:'0 auto',
            position:'absolute',
            backgroundColor:'lightgreen',
            borderRadius:10,
            padding:'7vh',
            textAlign:'center'
           
        }
        if(this.state.showSuccessDiv){
            return(

            <div style={style}>
                <div  style={successCard}>
                <h4>Success !!</h4>
                <br/>
                <h5>Data has been uploaded.</h5>
                <br/>

                <Button onClick={() => {this.setState({showSuccessDiv:false},  () => {this.getOptions()})}} > Okay</Button>

                </div>
               
            </div>

        )
        }
        
    }


    getDefaultCustomer = () => {
        if(localStorage.getItem("customer")) {
                var defaultVal=this.state.options.customerNames.filter((val) => {return val.value==localStorage.getItem("customer")} )
            console.log(defaultVal)
            return defaultVal
           }
           else{
            return null
            }
     }

    render(){
       
        const filterConfig = {
          //  ignoreCase:true,
            matchFrom: 'start',
            isCreatable:true
          };

        if(this.state.loading) {
            return <Loader />
        }
        else{
             return(
        <Container>

            <div>
           
                <Row>
    <Col  xs={12} sm={12} md={6} lg={6}>
    <h1 style={{display:'inline'}}>Entry</h1>
 
    </Col>
    <Col  xs={12} sm={12} md={6} lg={6}>
   
    <div style={{display:'flex', float:'right',   padding:20, justifyContent:'space-between'}}>
 <section>
 <Button style={{marginRight:10}} onClick= { (e) =>{ e.preventDefault(); this.props.history.goBack()}} variant="info"> Back   </Button>  
 <Button variant="success" style={{marginRight:10}} onClick={(e) => {e.preventDefault(); this.props.history.push(`${this.props.location.pathname}/dashboard`)}}>Dashboard</Button>
 <Button onClick= { (e) =>{ e.preventDefault(); localStorage.clear();this.props.history.push("/login")}} variant="danger"> Logout   </Button>  


 </section>

 </div>
    
    </Col>
</Row>

    

                {this.successOverlay()}

            <form onSubmit={this.handleSubmit}>
                
                <input type="date" placeholder="yyyy-mm-dd" required name="date" style={{width:'40vh'}} max={this.state.date} defaultValue={this.state.date}  onChange={this.handleChange} /> 
                <CreatableSelect defaultValue={this.getDefaultCustomer()} required maxMenuHeight={250} isClearable name="name" options={this.state.options.customerNames}  onChange={this.handleChange}
          placeholder="Customer Name"/>
                

  
                <CreatableSelect  required maxMenuHeight={250} isClearable options={this.state.options.productNames} name="product"  onChange={this.handleChange}  placeholder="Product Name"/>
                
                <CreatableSelect maxMenuHeight={250}
     required isClearable options={this.state.options.supplierNames} name="supplier"  onChange={this.handleChange}  placeholder="Supplier Name"/>
                
                
                <CreatableSelect  required maxMenuHeight={250} isClearable options={this.state.options.gradeNames} name="grade" onChange={this.handleChange}  placeholder="Grade"/>
                
                <input type="text" required name="quantity" onChange={this.handleChange}  placeholder="Quantity" />
               
                <CreatableSelect required isClearable maxMenuHeight={250} options={this.state.options.unitNames} name="unit" onChange={this.handleChange}  placeholder="Unit"/>
              
                
               
                <input type="radio"  name="domestic" value="domestic" checked={this.state.type=="domestic"} onChange={this.handleTypeChange}/> <span> Domestic </span> 
                <input type="radio"  name="export" value="export"  checked={this.state.type=="export"} onChange={this.handleTypeChange} /> <span> Export </span> 
          
          <br/>
          <br/>
          <Button variant="primary"  onClick={(e) => {e.preventDefault(); this.handleSaveAndContinue(e)}}>Save and Continue</Button>
          <Button style={{marginLeft:10}} type="submit" variant="warning">Submit</Button>
          <br/>
          <br/>



</form>

        </div>
      
        </Container>
          )
        }

       
    }
}