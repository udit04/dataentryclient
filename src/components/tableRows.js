import React, {Component} from 'react'
import {Button, Modal} from 'react-bootstrap'
import axios from 'axios'
import endpoint from '../config'
export default class tableRows extends Component {
    constructor(props){
        super(props)
        this.state={
            showModal:false,
            po:false,
            quotation:false,
            showDeleteModal:false
        }
    }

    handleClose = () =>{
        this.setState({showModal:false})
      }


      handleSubmit =  (event, item) =>{
          event.preventDefault()
          var data=this.state
        data.entry_id=item._id
        console.log(data, this.props.source)
        axios.post(endpoint.host+`/processEntry/${this.props.source}`, data).
        then((response) => {
            console.log(response.data)
            this.props.fetchData(this.props.source)
        }).
        catch ((err) => {
            console.log(err)
        })
       
      }
      changePoType = (e) =>{
          this.setState({po:e.target.name=="po_yes"})
      }
      changeQuotationType = (e) =>{
        this.setState({quotation:e.target.name=="quot_yes"})
    }


    deleteEntry = (entry_id) =>{
        console.log(entry_id)
        axios.post(endpoint.host+"/deleteEntry", {entry_id}).
        then((response)=>{
            console.log(response.data)
            this.props.getData("total")
        }).catch((err)=>{
            console.log(err)
        })
    }

    showDeleteModal = () => {
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
            console.log(this.props.value._id) 
        if(this.state.showDeleteModal){
             return(

            <div style={style}>
                <div  style={successCard}>
                <h4>Are you sure you want to delete this entry ?</h4>
                <br/>
               <Button variant="danger" onClick={()=>{this.deleteEntry(this.props.value._id)}}> Yes </Button>
               <Button variant="success" onClick={()=>{this.setState({showDeleteModal:false})}}> No </Button>
                
                <br/>
                
              
               
                </div>
               
            </div>

        )
        }
       
        
        
    }

    renderFormModal = (item) => {
      
        if(this.state.showModal){
           
            return (
                <div>
                <Modal centered="true" style={{textAlign:'center'}} show={this.state.showModal} onHide={() => {this.handleClose()}} >
          
                <Modal.Body centered="true" >
      
                <h4>
                   {item.customer_name}
                </h4>
              

               <form onSubmit={(event) => {this.handleSubmit(event, item)}}>
              
               {item.processed=="no"?       <div>
  <span style={{fontWeight:'bold'}}>Quotation</span>
                <br/>
                <input type="radio" name="quot_yes" onChange={this.changeQuotationType} checked={this.state.quotation}/>
            <span> Yes </span>  
                 <input type="radio" name="quot_no" onChange={this.changeQuotationType} checked={!this.state.quotation} />
                <span> No </span>
                <br/>
                <br/>
                </div>:
                <div>
                   <span style={{fontWeight:'bold'}}>PO</span>
                 <br/>                
                <input type="radio" name="po_yes" onChange={this.changePoType} checked={this.state.po}/>
              <span> Yes </span> 
                <input type="radio" name="po_no" onChange={this.changePoType} checked={!this.state.po} />
                <span> No </span>
                <br/>
                <br/> 
                {!this.state.po?   <div style={{paddingLeft:'20%', paddingRight:'20%', textAlign:'center'}}>
                    <span>Remark</span>
                <input type="text" name="remark" placeholder="Remark" onChange={(e) => {console.log(this.state.remark); this.setState({[e.target.name]:e.target.value.trim()})}} />
                </div>:""
            }
               </div>
               
              }
              
                <br/>

                <Modal.Footer>     <Button  variant="dark" onClick={(e) => {e.preventDefault(); this.handleClose()}}>
      
      Close
                </Button>
                <Button type="submit" variant="info" >
      
      Process Order
                </Button>
  
  </Modal.Footer>
           
               {/* <p>Submit</p>
                <input type="submit"  value= "Submit"/> */}

            </form>


               
                </Modal.Body>
                
              
              </Modal></div>
          
             )
        }
    }
    processOrder = () => {
        this.setState({showModal:true})
    }
    render(){
        return (
            
                   <tr >
                        <td>{this.props.ind+1}</td>
                        <td>{this.props.value.customer_name}</td>
                        <td>{this.props.value.product_name}</td>
                        <td>{this.props.value.supplier_name}</td>
                        <td>{this.props.value.type}</td>
                        <td>{this.props.value.grade}</td>
                        <td>{this.props.value.unit}</td>
                        <td>{this.props.value.quantity}</td>
                        <td>{this.props.value.po}</td>
                        <td>{this.props.value.quotation}</td>
                        <td>{this.props.value.date}</td>
                    {this.props.showRemark?  this.props.value.remark?< td>{this.props.value.remark}</td>:< td>None</td>:""}
                    {this.props.showProcessButton?   < td><Button onClick={() => {this.processOrder(this.props.value)}}>Process</Button></td>:<td>{this.props.value.processed}</td>}
                   {this.renderFormModal(this.props.value)}
                   {this.showDeleteModal()}
                   {this.props.showActions?   < td>
                   
                   {/* <Button onClick={() => {console.log(this.props.value._id)}} variant="info" size="sm">Edit</Button>  */}
                   <Button onClick={() => {this.setState({showDeleteModal:true})}} variant="danger" size="sm">Delete</Button></td>:""}
                   
                      </tr>
            
           
         
        )
    }

}