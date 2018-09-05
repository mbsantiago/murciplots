import React from 'react';
import ReactDOM from 'react-dom';
import Plots from './plots';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';


var anp = 'El Triunfo';

ReactDOM.render(
  <Plots anp={anp}/>,
  document.getElementById('root')
);
