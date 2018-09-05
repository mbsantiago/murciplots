import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Row } from 'reactstrap';

import * as d3 from 'd3';
import './species_list.css';
import * as d3sankey from 'd3-sankey';



const num_familias = 5;
const num_generos = 12;
const num_species = 50;


let genus_indices = [];
for (var i = 0; i < num_generos; i++){
  genus_indices.push(Math.floor(num_familias * Math.random()));
}

let taxonomy = {};
for (var j = 0; j < num_species; j++){
  let genus_index = Math.floor(num_generos * Math.random());
  let family_index = genus_indices[genus_index];

  taxonomy['Murci' + j] = {
    family: 'Familia' + family_index,
    genus: 'Genero' + genus_index
  };
}

class SpeciesListPlot extends Component {

  constructor(props){
    super(props);
    this.data = props.data;

    this.createPlot = this.createPlot.bind(this);
    this.height = 600;
    this.width = 946;

    this.state = {
      year: props.data.years[0],
      type: "pulse"
    };
  }

  componentDidMount() {
    this.createPlot();
  }

  componentDidUpdate() {
    this.createPlot();
  }

  sumArrays(arr) {
    let sum = 0;

    for (var i = 0; i < arr.length; i++) {
      for (var j = 0; j < arr[i].length; j++) {
        sum += arr[i][j];
      }
    }

    return sum;
  }

  getData(year, type) {
    let species_name = this.data.species.names;
    let calls = this.data.species[type][year];

    let links = [];
    let nodes = [];

    let genus_averages = {};
    let genus2family = {};
    let indices = {};

    let index = 0;

    const arrSum = arr => arr.reduce((a,b) => a + b, 0);

    for (var i = 0; i < species_name.length; i++) {
      let specie = species_name[i];
      nodes.push({name: specie});
      indices[specie] = index;
      index++;

      let genus = taxonomy[specie].genus;
      if (!(genus in indices)) {
        nodes.push({name: genus});
        indices[genus] = index;
        index++;
      }

      let family = taxonomy[specie].family;
      if (!(family in indices)){
        nodes.push({name: family});
        indices[family] = index;
        index++;
      }

      genus2family[genus] = family;

      let total_calls = this.sumArrays(calls[specie]);
      if (genus in genus_averages) {
        genus_averages[genus].push(total_calls);
      } else {
        genus_averages[genus] = [total_calls];
      }

      links.push({
        source: indices[specie],
        target: indices[genus],
        value: total_calls
      });
    }

    for (var genus in genus_averages) {
      let sum_intensity = arrSum(genus_averages[genus]);
      let family = genus2family[genus];

      links.push({
        source: indices[genus],
        target: indices[family],
        value: sum_intensity
      });
    }

    let link_data = {
      nodes: nodes,
      links: links
    };

    return link_data;
  }

  createPlot() {
    const svg = d3.select(this.node);
    svg.selectAll("*").remove();

    const data = this.getData(this.state.year, this.state.type);
    const height = this.height;
    const width = this.width;

    const { nodes, links } = d3sankey.sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .extent([[1, 1], [width - 1, height - 5]])({
          nodes: data.nodes.map(d => Object.assign({}, d)),
          links: data.links.map(d => Object.assign({}, d))
        });

    const color = d3.scaleOrdinal(d3.schemeSet3);

    function format(d) {
      const f = d3.format(",.0f");
      return `${f(d)} TWh`;
    }

    svg.append("g")
        .attr("stroke", "#000")
      .selectAll("rect")
      .data(nodes)
      .enter().append("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("fill", d => color(d.name))
      .append("title")
        .text(d => `${d.name}\n${format(d.value)}`);

    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.5)
      .selectAll("g")
      .data(links)
      .enter().append("g")
        .style("mix-blend-mode", "multiply");

    const gradient = link.append("linearGradient")
        .attr("id", d => (d.uid = 'link' + d.index))
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", d => d.source.x1)
        .attr("x2", d => d.target.x0);

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", d => color(d.source.name));

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", d => color(d.target.name));

    link.append("path")
        .attr("d", d3sankey.sankeyLinkHorizontal())
        .attr("stroke", d => 'url(' + window.location.href + '#' + d.uid + ')')
        .attr("stroke-width", d => Math.max(1, d.width));

    link.append("title")
        .text(d => `${d.source.name} → ${d.target.name}\n${format(d.value)}`);

    svg.append("g")
        .style("font", "10px sans-serif")
      .selectAll("text")
      .data(nodes)
      .enter().append("text")
        .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
        .text(d => d.name);
   }

  handleYearClick(year) {
    this.setState({year: year});
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
        </Row>
        <Row>
          <svg
            ref={node => this.node = node}
            width={this.width} height={this.height}>
          </svg>
        </Row>
      </Container>);
  }
}

export default SpeciesListPlot;
