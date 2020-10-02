import React, {Component} from 'react'
import {  Spinner } from 'react-bootstrap'

export default class Loader extends Component {
    render() {
        return(
            <div style={{position:'absolute',top:"48%", left:"48%", textAlign:'center'}}>
                   <Spinner animation="border" role="status">
  <span className="sr-only">Loading...</span>
</Spinner>
                </div>
        )
    }

}