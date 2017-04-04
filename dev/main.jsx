import React from 'react';
import ReactDOM from 'react-dom';
import {Grid, Row, Col} from 'react-bootstrap';

import Task from './task/index.jsx';

export default class Page extends React.Component{
    render(){
        return(
            <Grid>
                <Row>
                    <Col xs = {12} sm = {12} className = "text-center">
                        <h1>Понятие о синтаксически управляемой трансляции</h1>
                        <h2>Рябцев Владимир Дмитриевич.</h2>
                    </Col>
                </Row>
                <Row>
                    <Col xs = {12} sm = {12} className = "text-center">
                        <h4>
                            Разработать алгоритм и программу синтаксически управляемой трансляции простых операторов присваивания, содержащих как целые, так и вещественные переменные. В состав выражения могут входить операции сложения, вычитания, умножения и унарный минус.
                        </h4>
                        <h4>
                            2. Генерация оптимального кода.
                        </h4>
                        <Task />
                    </Col>
                </Row>
            </Grid>
        );
    }
}

ReactDOM.render(<Page />, document.getElementById('app'));