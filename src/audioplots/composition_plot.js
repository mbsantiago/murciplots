import React, { Component } from 'react';

import * as d3 from 'd3';
import * as d3sankey from 'd3-sankey';
import './composition_plot.css';


const diet_labels = [
  'insectivore',
  'nectarivore',
  'frugivore',
  'carnivore',
  'piscivore',
  'sanguinivore',
  'omnivore'
];


class CompositionPlot extends Component {

  constructor(props){
    super(props);
    this.data = props.data.comp_graph;
    this.years = Object.keys(this.data);

    this.createPlot = this.createPlot.bind(this);
    this.height = 600;
    this.width = "100%";

    this.state = {
      year: this.years[0],
      type: 'taxa'
    };

    this.myRef = React.createRef();
  }

  componentDidMount() {
    this.createPlot();
  }

  componentDidUpdate() {
    this.createPlot();
  }

  preprocessData(data) {
    let typeFunc;

    if (this.state.type === 'taxa') {
      typeFunc = d => diet_labels.indexOf(d.target) < 0;
    } else {
      typeFunc = d => diet_labels.indexOf(d.target) >= 0;
    }

    console.log(data.edges.filter(d => d.source === d.target));

    let significant = data.edges
      .filter(d => d.intensity > 0)
      .filter(d => d.source !== d.target)
      .filter(typeFunc);

    let nodes = [];
    let links = [];

    let indexMap = {};
    let index = 0;

    for (var i = 0; i < significant.length; i++) {
      let obj_target = significant[i]['target'];
      let obj_source = significant[i]['source'];

      if (!(obj_source in indexMap)) {
        nodes.push({name: obj_source});
        indexMap[obj_source] = index;
        index++;
      }

      if (!(obj_target in indexMap)) {
        nodes.push({name: obj_target});
        indexMap[obj_target] = index;
        index++;
      }

      let source_index = indexMap[obj_source];
      let target_index = indexMap[obj_target];
      let obj_value = significant[i].intensity;

      let new_link = {
        source: source_index,
        target: target_index,
        value: obj_value
      };

      links.push(new_link);
    }

    return {
      nodes: nodes.map(d => Object.assign({}, d)),
      links: links.map(d => Object.assign({}, d))};
  }

  createPlot() {
    const svg = d3.select(this.node);
    svg.selectAll("*").remove();

    const height = this.height;
    const width = this.myRef.current.clientWidth;

    const data = this.preprocessData(this.data[this.state.year]);

    const { nodes, links } = d3sankey.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 1], [width - 1, height - 5]])(data);

    const color = d3.scaleOrdinal(d3.schemeSet3);

    function format(d) {
      const f = d3.format(",.1f");
      return `${f(d)} pasos/día`;
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

  handleTypeClick(type) {
    this.setState({type: type});
  }

  getButtons() {
    const year_buttons = this.years.map(
      (year) => (
        <div
          className={year === this.state.year ? 'btn btn-primary': 'btn btn-secondary'}
          onClick={() => this.handleYearClick(year)}
        >
          {year}
        </div>));

    const type_buttons = ['taxa', 'diet'].map(
      (type) =>(
        <div
          class={type === this.state.type ? 'btn btn-primary': 'btn btn-secondary'}
          onClick={() => this.handleTypeClick(type)}
        >
          {type}
        </div>));

      return (
        <div className='btn-toolbar'>
          <div className='btn-group'>
            {year_buttons}
          </div>
          <div className='btn-group'>
            {type_buttons}
          </div>
        </div>);
  }

  render() {

    return (
      <div class='plot'>
        {this.getButtons()}
        <div ref={this.myRef}>
          <svg
            ref={node => this.node = node}
            width={this.width} height={this.height}>
          </svg>
        </div>
      </div>);
  }
}

export default CompositionPlot;
