import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import request from 'request';
import './index.css';

import IntensidadPlot from './intensity';
import SpeciesListPlot from './species_list';
import HorasPlot from './hour_activity';
import CambioPlot from './change';


class Plots extends Component {

  constructor(props) {
    super(props);
    this.anp = props.anp;
    this.state = {
      data: null,
      loaded: false,
      type: 'composicion'
    };
  }

  componentDidMount() {
    console.log('Did mount');
    this.loadData();
  }

  getGraph() {
    var type = this.state.type;

    if (type === 'composicion') {
      return "composición";
    } else if (type === 'lista especies') {
      return "lista especies";
    } else if (type === 'actividad diaria' ) {
      return "actividad diaria";
    } else if (type === 'anual') {
      return "anual";
    }
  }

  loadData() {
    const url = 'http://nodo5:9312/?anp=' + this.anp;

    request(url, (err, res, body) => {
      this.setState({
        data: body,
        loaded: true
      });
    });
  }

  render() {
    if (this.state.loaded) {
      return this.getGraph();
    } else {
      return <ReactLoading type={'spin'} color={'green'} height={'10%'} width={'10%'} />;
    }
  }
}

export default Plots;
