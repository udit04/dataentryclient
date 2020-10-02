import React, {Component} from 'react'
import LocalStorageService from '../LocalStorageService'
import { Container, Row, Col , Button, Card, Table} from 'react-bootstrap'
import endpoint from '../config'
import axios from 'axios'
import Loader from './loader'
import TableRows from './tableRows.js'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import {  Spinner } from 'react-bootstrap'

export default class Dashboard extends Component{
    constructor(props){
        super(props)
        this.state={
            loading:true,
            showExcelDialog:false
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

        
        this.getData("total")
    }

    getDataLengths = () => {

        axios.get(endpoint.host+"/getDataSizes/all").
        then((response) =>{
            console.log(response.data)
            this.setState({lengths:response.data})
        })
        .catch((err) =>{
            console.log(err)
        })

    }
    getData = (type) => {
        this.setState({loading:true}, () =>{

            axios.get(endpoint.host+`/getData/${type}/all`).
            then( async (response) => {
                console.log(response.data)
                await this.getDataLengths()
                this.setState({data:response.data,originalData:response.data, loading:false})
            }).
            catch((err) =>{
                console.log(err)
            })

        })
    }

    downloadInExcel = () =>{
       
        this.setState({showExcelDialog:true}, ()=>{
           
            if(this.state.data.length>0){
                const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                const fileExtension = '.xlsx';
                const ws = XLSX.utils.json_to_sheet(this.state.data);
                const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
                const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                const data = new Blob([excelBuffer], {type: fileType});
                FileSaver.saveAs(data, "dataEntry" + fileExtension);
                this.setState({showExcelDialog:false})
            }
           
        })
           
        
    }

    
    showTable = () =>{

      if(!this.state.loading) {

        if(this.state.data.length){return(

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
                        <th>Remark</th>
                        <th>Processed</th>
                        <th>Actions</th>
                        </tr>
                    </thead>

                  <tbody>



                  {this.state.data.map( (value, ind) => {
                    return  <TableRows getData={this.getData}  showActions={true} showProcessButton={false} showRemark={true} fetchData={this.fetchData} key={ind} value={value} ind={ind}/>
                  })}
                  </tbody>

                </Table>

            )
        }
        else{
            return(
            <div style={{ display: 'flex', textAlign:'center', alignItems:'center', justifyContent:'center', width:'100%', minHeight:'30vh'}}>
               
               
               
                <div style={{display:'block'}}>
                <div style={{ display: 'flex', alignItems:'center', justifyContent:'center'}}>
                <h1>&#128577;</h1>
               </div>
                     <h1> No Data Here!</h1>
                </div>
               
                </div>)
            
        }



      }
     
    }

    showExcelWaitDownload = () => {
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
        if(this.state.showExcelDialog){
            return(

            <div style={style}>
                <div  style={successCard}>
                <h4>Exporting Data.</h4>
                <br/>
                <h5>Preparing Data for Download.</h5>
                <br/>
                <Spinner animation="border" role="status">
  <span className="sr-only">Loading...</span>
</Spinner>
              
               
                </div>
               
            </div>

        )
        }
        
    }

searchData = (searchText) => {
    searchText=searchText.toLowerCase()
    var data=this.state.originalData
    data=data.filter((val) => {return val.customer_name.toLowerCase().startsWith(searchText) || val.product_name.toLowerCase().startsWith(searchText) || val.grade.toLowerCase().startsWith(searchText) || val.unit.toLowerCase().startsWith(searchText) || val.supplier_name.toLowerCase().startsWith(searchText) || val.processed.toLowerCase().startsWith(searchText) } )
    this.setState({data})
}

    render(){

        if(this.state.loading){

            return(<Loader />)
        }
        else{
             return(
            <Container >
                {this.showExcelWaitDownload()}


<div>
    
<Row>
    <Col  xs={12} sm={12} md={8} lg={8}>
    <h1 style={{display:'inline'}}>Dashboard</h1> 
    </Col>
    <Col  xs={12} sm={12} md={4} lg={4}>
   
    <div style={{display:'flex', float:'right',  padding:20, justifyContent:'space-between'}}>
    <section>
 <Button style={{marginRight:10}} onClick= { (e) =>{ e.preventDefault(); this.props.history.goBack()}} variant="info"> Back   </Button>  
 <Button onClick= { (e) =>{ e.preventDefault(); localStorage.clear();this.props.history.push("/login")}} variant="danger"> Logout   </Button>  

 </section>
 </div>
    
    </Col>
</Row>

    

</div>

<div>
            <Row>
                <Col xs={6} sm={6} md={3} lg={3} style={{padding:20}} >
                <Card border="dark"onClick={(e) => {e.preventDefault(); this.getData("total")}} style={{ display: 'flex', alignItems:'center', justifyContent:'center', justifyItems:'center', backgroundColor:'coral', width:'100%', minHeight:'10vh', cursor:'pointer'}}>

             <h5>Total Queries : {this.state.lengths?this.state.lengths.Total:""}</h5>


</Card>

                </Col>

                <Col xs={6} sm={6} md={3} lg={3}  style={{padding:20}}>
               
                <Card border="dark"onClick={(e) => {e.preventDefault(); this.getData("Mt")}} style={{ display: 'flex', alignItems:'center', justifyContent:'center', justifyItems:'center', backgroundColor:'coral', width:'100%', minHeight:'10vh', cursor:'pointer'}}>

<h5>Total Mt Queries : {this.state.lengths?this.state.lengths.mt:""}</h5>


</Card>

                </Col>
                <Col xs={6} sm={6} md={3} lg={3}  style={{padding:20}}>
               
                <Card border="dark"onClick={(e) => {e.preventDefault(); this.getData("kg")}} style={{ display: 'flex', alignItems:'center', justifyContent:'center', justifyItems:'center', backgroundColor:'coral', width:'100%', minHeight:'10vh', cursor:'pointer'}}>

<h5>Total 100 Kg Queries :{this.state.lengths?this.state.lengths.kg:""}</h5>


</Card>
               
                 </Col>

                <Col xs={6} sm={6} md={3} lg={3}  style={{padding:20}}>
               
                <Card border="dark"onClick={(e) => {e.preventDefault(); this.getData("rest")}} style={{ display: 'flex', alignItems:'center', justifyContent:'center', justifyItems:'center', backgroundColor:'coral', width:'100%', minHeight:'10vh', cursor:'pointer'}}>

<h5>Rest Queries : {this.state.lengths?this.state.lengths.rest:""}</h5>


</Card>
                 </Col>
                 
            </Row>

</div>


    <div style={{display:'flex', padding:20, justifyContent:'space-between'}}>
 <input name="search" type="text" style={{display:"inline", paddingTop:2, paddingBottom:2, margin:3, width:'70%',float:'right'}} placeholder="Search...." onChange={(event) => {this.searchData(event.target.value)}}/>
 <Button variant="info" disabled={this.state.data?this.state.data.length>0?false:true:true}  onClick={(e) => {e.preventDefault(); this.downloadInExcel()}}>Export data</Button>

 
</div>


         <div>

             {this.showTable()}
         </div>
            </Container>
        )
        }

       
    }
}