import React, { Component } from 'react'
import {Container, Col, Row, Button} from 'react-bootstrap'
import axios from 'axios'
import endpoint from '../config'
//import LocalStorageService from '../LocalStorageService'
import CreatableSelect from 'react-select/creatable';
import { typeOptions } from '../constants'
import csc from 'country-state-city'

export default class login extends Component {
    constructor(props){
        super(props)
        this.state = {
            type : null,
            allCountries : null,
            allStates: null,
            allCities: null,
            enableSubmit: false
        }
    }

    handleChange = (event) =>{
        this.setState({[event.target.name]:event.target.value})
        this.checkSubmitValidation();
    }

    handleTypeChange = (newValue,actionMeta) => {
        if(!newValue)return;
        this.setState({[actionMeta.name]:newValue.value})
        if(!this.state.allCountries){
            this.setState({
                allCountries: csc.getAllCountries().map((country)=>{return {value: country.name,label:country.name,id:country.id}})
            })
        }
        if(actionMeta.name === 'country1' || actionMeta.name === 'country2'){
            this.setState({
                allStates: csc.getStatesOfCountry(newValue.id).map((state)=>{return {value: state.name,label:state.name,id:state.id}})
            })
        }
        else if(actionMeta.name === 'region1' || actionMeta.name === 'region2'){
            this.setState({
                allCities: csc.getCitiesOfState(newValue.id).map((city)=>{return {value: city.name,label:city.name,id:city.id}})
            })
        }
        this.checkSubmitValidation();
    };

    checkSubmitValidation(){
        const {type,company_name,contact_number,email,website,country1,region1,city1,address1,enableSubmit} = this.state;
        if(type && company_name && contact_number && email && website && country1 && region1 && city1 && address1 && !enableSubmit){
            this.setState({enableSubmit : true})
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        axios.post(endpoint.host+"/api/create", this.state).
        then((response) => {
            console.log(response.data);
            if(response.data && response.data.sucess === 1){
                alert('Record inserted successfully!');
            }
            else{
                alert('Some error occured!');
            }
        }).catch ((err)=>{console.log('err',err);alert('Some error occured. Please try again.')})
    }

    render(){
        const {type, allCountries, allStates, allCities, country1, region1, city1, country2, region2, city2, company_name, address1, address2, enableSubmit } = this.state;
        return(
            <Container style={{textAlign:'center', padding:40}}>
                <Col xs={12} sm={12} md={12} lg={12}><h1 style={{display:'inline', textAlign:'center'}}>Company Data</h1></Col>
                <form onSubmit={this.handleSubmit}>
                    <Row>
                        <span>Type</span>
                        <CreatableSelect required maxMenuHeight={250} isClearable={false} name="type" options ={typeOptions} onChange={this.handleTypeChange} placeholder="Type"/>
                    </Row>
                    {
                        type &&
                        <>
                        <Row>
                            <span>Company Name</span>
                            <input required type="text" name="company_name" placeholder='Company Name' onChange={this.handleChange}></input>
                        </Row>

                        <Row>
                            <span>Primary Contact Number</span>
                            <input required type="number" name="contact_number" placeholder="Primary Contact Number" onChange={this.handleChange}></input>
                        </Row>

                        <Row>
                            <span>Email</span>
                            <input type="email" name="email" autoComplete='off' placeholder="Email" onChange={this.handleChange}></input>
                        </Row>
                        <Row>
                            <span>Website</span>
                            <input type="text" name="website" placeholder="Website URL" onChange={this.handleChange}></input>
                        </Row>

                        {
                        allCountries && <>
                        <Row >
                            <Col lg={6} md={6} sm={6}>
                                <span>Country 1</span>
                                <CreatableSelect required isClearable={false} isFixed maxMenuHeight={250} isClearable name="country1" options ={allCountries} onChange={this.handleTypeChange} placeholder="Select Country 1"/>
                            </Col>
                            <Col lg={6} md={6} sm={6}>
                                <span>Country 2</span>
                                <CreatableSelect isDisabled ={!country1} required isClearable={false} isFixed maxMenuHeight={250} isClearable name="country2" options ={allCountries} onChange={this.handleTypeChange} placeholder="Select Country 2"/>
                            </Col>
                        </Row>                      
                        </>
                        }
                        {
                        allStates && <>
                        <Row >
                            <Col lg={6} md={6} sm={6}>
                                <span>Region/State 1</span>
                                <CreatableSelect required isClearable={false} isFixed maxMenuHeight={250} isClearable name="region1" options ={allStates} onChange={this.handleTypeChange} placeholder="Select State"/>
                            </Col>
                            <Col lg={6} md={6} sm={6}>
                                <span>Region/State 2</span>
                                <CreatableSelect required isClearable={false} isFixed maxMenuHeight={250} isClearable name="region2" options ={allStates} onChange={this.handleTypeChange} placeholder="Select State"/>
                            </Col>
                        </Row>                      
                        </>
                        }
                        {
                        allCities && <>
                            <Row >
                                <Col lg={6} md={6} sm={6}>
                                <span>City 1</span>
                                    <CreatableSelect required isClearable={false} isFixed maxMenuHeight={250} isClearable name="city1" options ={allCities} onChange={this.handleTypeChange} placeholder="Select Region 1"/>
                                </Col>
                                <Col lg={6} md={6} sm={6}>
                                    <span>City 2</span>
                                    <CreatableSelect required isClearable={false} isFixed maxMenuHeight={250} isClearable name="city2" options ={allCities} onChange={this.handleTypeChange} placeholder="Select Region 2"/>
                                </Col>
                            </Row>                      
                        </>
                        }
                        {
                        (city1 || city2) && <>
                        <Row >
                            <Col lg={6} md={6} sm={6}>
                            <span>Address 1</span>
                                <input type="text" name="address1" autoComplete='off' placeholder="Address 1" onChange={this.handleChange}></input>
                            </Col>
                            <Col lg={6} md={6} sm={6}>
                                <span>Address 2</span>
                                <input type="text" name="address2" autoComplete='off' placeholder="Address 2" onChange={this.handleChange}></input>
                            </Col>
                        </Row>                      
                        </>
                        }                  
                        </>
                    }
                    {
                        (address1 || address2) &&
                        <>
                            <Col xs={12} sm={12} md={12} lg={12}><h1 style={{display:'inline', textAlign:'center'}}>Contact Person Data</h1></Col>
                            {   
                                <Row >
                                    <Col lg={6} md={6} sm={6}>
                                        <span>Person Name 1</span>
                                        <input type="text" name="contact_name1" placeholder="Contact Name 1" onChange={this.handleChange}></input>
                                    </Col>
                                    <Col lg={6} md={6} sm={6}>
                                        <span>Person Name 2</span>
                                        <input type="text" name="contact_name2" placeholder="Contact Name 2" onChange={this.handleChange}></input>
                                    </Col>
                                </Row>
                            }

                            {   
                                <Row >
                                    <Col lg={6} md={6} sm={6}>
                                        <span>Phone Number 1</span>
                                        <input type="number" name="contact_number1" placeholder="Contact Number 1" onChange={this.handleChange}></input>
                                    </Col>
                                    <Col lg={6} md={6} sm={6}>
                                        <span>Phone Number 2</span>
                                        <input type="number" name="contact_number2" placeholder="Contact Number 2" onChange={this.handleChange}></input>
                                    </Col>
                                </Row>
                            }
                            {   
                                <Row >
                                    <Col lg={6} md={6} sm={6}>
                                        <span>Designation 1</span>
                                        <input type="text" name="designation1" placeholder="Contact Designation 1" onChange={this.handleChange}></input>
                                    </Col>
                                    <Col lg={6} md={6} sm={6}>
                                        <span>Designation 2</span>
                                        <input type="text" name="designation2" placeholder="Contact Designation 2" onChange={this.handleChange}></input>
                                    </Col>
                                </Row>
                            }
                            {   
                                <Row >
                                    <Col lg={6} md={6} sm={6}>
                                        <span>Email 1</span>
                                        <input type="email" name="email1" autoComplete='off' placeholder="Contact Email 1" onChange={this.handleChange}></input>
                                    </Col>
                                    <Col lg={6} md={6} sm={6}>
                                        <span>Email 2</span>
                                        <input type="email" name="email2" autoComplete='off' placeholder="Contact Email 2" onChange={this.handleChange}></input>
                                    </Col>
                                </Row>
                            }
                            {   
                                <Row >
                                    <Col lg={6} md={6} sm={6}>
                                        <span>LinkedIn Profile 1</span>
                                        <input type="text" name="linkedin_profile1" autoComplete='off' placeholder="Contact LinkedIn Profile 1" onChange={this.handleChange}></input>
                                    </Col>
                                    <Col lg={6} md={6} sm={6}>
                                        <span>LinkedIn Profile 2</span>
                                        <input type="text" name="linkedin_profile2" autoComplete='off' placeholder="Contact LinkedIn Profile 2" onChange={this.handleChange}></input>
                                    </Col>
                                </Row>
                            }                     
                        </>
                    }
                    <Row>
                        <Button block variant="warning" type="submit" disabled={!enableSubmit}>Submit</Button>
                    </Row>
                </form>
            </Container>
        )
    }
}