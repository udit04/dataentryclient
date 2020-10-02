import React, { Component } from 'react'
import {Container, Col, Row, Button} from 'react-bootstrap'
import axios from 'axios'
import endpoint from '../config'
//import LocalStorageService from '../LocalStorageService'
import CreatableSelect from 'react-select/creatable';
import { productCategoryOptions } from '../constants'

export default class login extends Component {
    constructor(props){
        super(props)
        this.state = {
            supplierList: [],
            product_name: '',
            cas_number : '',
            pharam_ceophia: '',
            enableSubmit: false
        }
    }

    handleChange = (event) =>{
        this.setState({[event.target.name]:event.target.value})
        const new_state = {...this.state,[event.target.name]:event.target.value};
        this.checkSubmitValidation(new_state);
    }

    handleTypeChange = (newValue,actionMeta) => {
        if(!newValue)return;
        const new_state = {...this.state,[actionMeta.name]:newValue.value};
        this.setState({[actionMeta.name]:newValue.value});
        this.checkSubmitValidation(new_state);
    };

    checkSubmitValidation(new_state){
        const {supplier_id,product_name,cas_number,pharam_ceophia,category,enableSubmit} = new_state;
        if(supplier_id && product_name && cas_number && pharam_ceophia && category && !enableSubmit){
            this.setState({enableSubmit : true})
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        axios.post(endpoint.host+"/api/insertproducts", this.state).
        then((response) => {
            console.log(response.data);
            if(response.data && response.data.sucess === 1){
                alert('Product inserted successfully!');
                this.setState({
                    product_name : '',
                    cas_number : '',
                    pharam_ceophia: ''
                })
            }
            else{
                alert('Some error occured!');
            }
        }).catch ((err)=>{console.log('err',err);console.log('err response',err.response);alert('Some error occured. Please try again.')})
    }

    componentDidMount(){
        axios.get(endpoint.host+"/api/getsupplier").
        then((response) => {
            console.log(response.data);
            if(response.data && response.data.sucess === 1){
                const tempData = response.data.data.map((sup)=>{return {value: sup.id, label: sup.company_name}});
                this.setState({supplierList: tempData})
            }
            else{
                alert('Some error occured!');
            }
        }).catch ((err)=>{console.log('err',err);alert('Some error occured. Please try again.')})
    }

    render(){
        const { enableSubmit, supplier_id, supplierList, product_name, cas_number, pharam_ceophia } = this.state;
        return(
            <Container style={{textAlign:'center', padding:40}}>
                <Col xs={12} sm={12} md={12} lg={12}><h1 style={{display:'inline', textAlign:'center'}}>Add Supplier Products</h1></Col>
                <form onSubmit={this.handleSubmit}>
                    <Row>
                        <span>Suppliers</span>
                        <CreatableSelect required maxMenuHeight={250} name="supplier_id" options = {supplierList} onChange={this.handleTypeChange} placeholder="Select Supplier"/>
                    </Row>
                    {
                        supplier_id &&
                        <>
                        <Row>
                            <span>Product Name</span>
                            <input required type="text" autoComplete='off' name="product_name" value={product_name} placeholder='Product Name' onChange={this.handleChange}></input>
                        </Row>

                        <Row>
                            <span>CAS Number</span>
                            <input required type="text" autoComplete='off' name="cas_number" value = {cas_number} placeholder="Enter CAS Number" onChange={this.handleChange}></input>
                        </Row>

                        <Row>
                            <span>Pharamcopoeia</span>
                            <input required type="text" name="pharam_ceophia" value = {pharam_ceophia} autoComplete='off' placeholder="Enter Pharamcopoeia" onChange={this.handleChange}></input>
                        </Row>
                        <Row>
                            <span>Product Category</span>
                            <CreatableSelect required maxMenuHeight={250} isClearable={false} name="category" options = {productCategoryOptions} onChange={this.handleTypeChange} placeholder="Select Product Category"/>
                        </Row>              
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