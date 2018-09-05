import React, { Component } from 'react';
import { BounceLoader } from 'react-spinners';
import request from 'request';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import CompositionPlot from './composition_plot';


class AudioPlots extends Component {

  constructor(props) {
    super(props);
    this.anp = props.anp;
    this.state = {
      data: null,
      loaded: false,
      type: 'composicion'
    };
  }

  getTypeButtons() {
    const types = [
      'composicion',
      'lista especies',
      'actividad diaria',
      'agregado anual'
    ];

    const buttons = types.map(
      (type) => (
        <div
          className={type === this.state.type? 'btn btn-primary': 'btn btn-secondary'}
          onClick={() => this.handleTypeClick(type)}
        >
        {type}
        </div>
      )
    );

    return (
      <div className='btn-group'>
        {buttons}
      </div>
    );
  }

  handleTypeClick(type) {
    this.setState({
      type: type
    });
  }

  componentDidMount() {
    this.loadData();
  }

  getGraph() {
    var type = this.state.type;

    if (type === 'composicion') {
      return <CompositionPlot data={this.state.data}/>;
    } else if (type === 'lista especies') {
      return "lista especies";
    } else if (type === 'actividad diaria' ) {
      return "actividad diaria";
    } else if (type === 'agregado anual') {
      return "agregado anual";
    }
  }

  loadData() {
    const url = 'http://nodo5:9312/?anp=' + this.anp;

    request(url, (err, res, body) => {
      this.setState({
        data: JSON.parse(body),
        loaded: true
      });
    });
  }

  render() {
    if (this.state.loaded) {
      if ("Error" in this.state.data) {
        return "No hay datos de Audio para esta ANP";
      } else {
        let content = this.getGraph();
        return (
          <div>
          {this.getTypeButtons()}
          {content}
          </div>
        );
      }
    } else {
      return <BounceLoader color='#72a052' />;
    }
  }
}

export default AudioPlots;
