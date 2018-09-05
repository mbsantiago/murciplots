import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Row, Dropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';
import Plot from 'react-plotly.js';
import './change.css';


class CambioPlot extends Component {
  constructor(props) {
    super(props);
    this.data = props.data;

    this.state = {
      year: props.data.years[0],
      name: props.data.species.names[0],
      type: "pulse",
      level: "species",
      dropdownOpen: false
    };
  }

  handleYearClick(year) {
    this.setState({year: year});
  }

  handleTaxonomyClick(level) {
    let name = this.data[level].names[0];
    this.setState({level: level, name:name});
  }

  selectPass() {
    this.setState({type: "pass"});
  }

  selectPulse() {
    this.setState({type: "pulse"});
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  build_data() {
    let data = [];

    let years = this.data.years;
    let level = this.state.level;
    let type = this.state.type;
    let name = this.state.name;

    let level_values = this.data[level][type];

    for (var i = 0; i < years.length; i++) {
      let year = years[i];
      let year_values = level_values[year][name];

      let values = year_values.reduce((x, y) => x.concat(y), []);

      var trace = {
        y: values,
        type: 'box',
        name: year
      };

      data.push(trace);
    }

    return data;
  }

  build_layout() {
    let type = this.state.type === 'pass'? 'Pasos': 'Pulsos';

    let title = type + ' promedio por año de ' + this.state.name;
    return {
      title: title
    };
  }

  selectName(name) {
    this.setState({name: name});
  }

  render() {
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

    const dropdown_options = this.data[this.state.level].names.map(
      (name) => (
        <DropdownItem
          onClick={() => this.selectName(name)}
        > {name} </DropdownItem>
      ));

    return (
      <Container>
      <Row>
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
      <Dropdown isOpen={this.state.dropdownOpen} toggle={() => this.toggle()}>
        <DropdownToggle caret>
          {this.state.level}
        </DropdownToggle>
        <DropdownMenu>
          {dropdown_options}
        </DropdownMenu>
      </Dropdown>
      </Row>
      <Row>
      <Plot data={this.build_data()} layout={this.build_layout()} />
      </Row>
      </Container>);
  }
}

export default CambioPlot;
