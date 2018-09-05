import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Row, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import Plot from 'react-plotly.js';
import './intensity.css';


class HorasPlot extends Component {
  constructor(props) {
    super(props);
    this.data = props.data;

    this.state = {
      year: props.data.years[0],
      type: "pulse",
      level: "species",
      name: props.data.species.names[0],
      dropdownOpen: false
    };
  }

  build_layout() {
    let type = this.state.type === 'pass'? 'Pasos': 'Pulsos';
    let level = this.state.level;
    let title = 'Actividad promedio diaria de ' + type + ' por ' + level;
    return {width: 800, title: title};
  }

  selectName(name) {
    this.setState({name: name});
  }

  build_data() {
    let level = this.state.level;
    let year = this.state.year;
    let type = this.state.type;

    let level_names = this.data[level].names;
    let baseline = this.data[level][type].baseline;
    let type_values = this.data[level][type][year];

    let hours = this.data.hours;

    let data = [];

    let mean = (x) => x.reduce((y, z) => y + z, 0) / x.length;

    let colors = [
      'rgb(166,206,227)',
      'rgb(31,120,180)',
      'rgb(178,223,138)',
      'rgb(51,160,44)',
      'rgb(251,154,153)',
      'rgb(227,26,28)'];

    for (var i = 0; i < level_names.length; i++) {
      let obj = level_names[i];
      let color_index = i % colors.length;
      let values = type_values[obj].map((x) => mean(x));

      data.push({
        name: obj,
        y: values,
        x: hours,
        mode: 'lines',
        line: {
          color: colors[color_index],
          width: 0.4
        }
      });
    }

    return data;
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

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
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
      {year_buttons}
      </ButtonGroup>
      </Row>
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

export default HorasPlot;
