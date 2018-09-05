import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Row } from 'reactstrap';
import Plot from 'react-plotly.js';
import './intensity.css';


class IntensidadPlot extends Component {
  constructor(props) {
    super(props);
    this.data = props.data;

    this.state = {
      year: props.data.years[0],
      type: "pulse",
      level: "species"
    };
  }

  build_data() {
    let box_color, opacity;

    let data = this.data;
    let type = this.state.type;
    let year = this.state.year;
    let level = this.state.level;

    let species_intensities = data[level][type][year];
    let compare_data = data[level][type].baseline;
    let species_names = data[level].names;
    let potential_species = data[level].potential;

    let plot_data = [];

    for (var i=0; i < potential_species.length; i++) {
      let species = potential_species[i];

      box_color = '#25283d';
      opacity = 0.7;

      let values = species_intensities[species].reduce((x, y) => x.concat(y), []);
      let baseline = compare_data[species].reduce((x, y) => x + y) / compare_data[species].length;

      let species_data = {
        x: values,
        y: i,
        type: 'box',
        name: species_names[i],
        showlegend: false,
        opacity: opacity,
        fillcolor: 'white',
        line: {
          color: box_color,
          width: 1
        }
      };

      let point_compare_data = {
        y: [species],
        x: [baseline],
        mode: 'markers',
        type: 'scatter',
        showlegend: false,
        opacity: opacity,
        marker: {
          symbol: '0',
          size: 6,
          color: 'red'
        }
      };

      plot_data.push(species_data, point_compare_data);
    }

    return plot_data;
  }

  build_layout() {
    let type = this.state.type === 'pass'? 'Pasos': 'Pulsos';
    let title = 'Intensidad de ' + type + ' en ' + this.state.year;

    return {
      width: 400,
      height: 600,
      title: title};
  }

  handleYearClick(year) {
    this.setState({year: year});
  }

  handleTaxonomyClick(level) {
    this.setState({level: level});
  }

  selectPass() {
    this.setState({type: "pass"});
  }

  selectPulse() {
    this.setState({type: "pulse"});
  }

  render() {
    const year_buttons = this.data.years.map(
      (year) => (
        <Button
        onClick={() => this.handleYearClick(year)}
        key={year}
        >
        {year}
        </Button>));

    const tax_buttons = [
      ['species', 'Especies'],
      ['genus', 'Genero'],
      ['family', 'Familia'],
      ['guild', 'Gremio']].map(
        (x) => (
          <Button
          onClick={() => this.handleTaxonomyClick(x[0])}
          key={x[0]}
          >
          {x[1]}
          </Button>));

    return (
      <Container>
        <Row>
          <ButtonGroup>
            {year_buttons}
          </ButtonGroup>
          <ButtonGroup>
            <Button
            onClick={() => this.selectPulse()}
            >
              {"Pulsos"}
            </Button>
            <Button
            onClick={() => this.selectPass()}
            >
              {"Pasos"}
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            {tax_buttons}
          </ButtonGroup>
        </Row>
        <Row>
          <Plot data={this.build_data()} layout={this.build_layout()} />;
        </Row>
      </Container>);
  }
}

export default IntensidadPlot;
