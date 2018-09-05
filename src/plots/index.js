import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Row } from 'reactstrap';
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

  getTypeButtons() {
    const types = [
      'composicion',
      'lista especies',
      'actividad diaria',
      'agregado anual'
    ];

    const buttons = types.map(
      (x) => (
        <Button
          onClick={() => this.handleTypeClick(x)}
          key={x}
        >
        {x}
        </Button>
      )
    );

    return (
      <ButtonGroup>
        {buttons}
      </ButtonGroup>
    );
  }

  handleTypeClick(type) {
    this.setState({
      type: type
    });
  }

  componentDidMount() {
    console.log('Did mount');
    this.loadData();
  }

  getGraph() {
    var type = this.state.type;

    if (type === 'composicion') {
      //return <SpeciesListPlot data={this.state.data}/>;
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
        data: body,
        loaded: true
      });
    });
  }

  render() {
    let content;

    if (this.state.loaded) {
      content = this.getGraph();
    } else {
      content = <ReactLoading type={'spin'} color={'green'} height={'10%'} width={'10%'} />;
    }

    return (
      <div>
        {this.getTypeButtons()}
        {content}
      </div>
    )
  }
}

export default Plots;
