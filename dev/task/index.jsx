import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import Main from './Main';

export default class Task extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: ""
        };
        this.Main = new Main("");
        this.handlerChangedInput = this.handlerChangedInput.bind(this);
    }

    handlerChangedInput(e){
        this.setState({
            data: e.target.value
        });
    }

    render(){
        this.Main.setData(this.state.data);
        let result = this.Main.Do();
        if (Array.isArray(result)){
            result = result.map(v => (
                <li className = "list-group-item list-group-item-success">
                    {v}
                </li>
            ));
        }else{
            result = (
                <li className = "list-group-item list-group-item-danger">
                    {result}
                </li>
            );
        }
        result = (
            <ul className = "list-group">
                {result}
            </ul>
        );

        return(
            <Row>
                <Col xs = {12} sm = {6} smOffset = {3}>
                    <input type = "text" onChange = {this.handlerChangedInput} className = "form-control" />
                    <br />
                    {result}
                </Col>
            </Row>
        );
    }
}