import React from 'react';
import ReactDOM from 'react-dom';
import AudioPlots from './audioplots';
import './index.css';


var anp = 'El Triunfo';

ReactDOM.render(
  <AudioPlots anp={anp}/>,
  document.getElementById('root')
);
