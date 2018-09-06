import React, { Component } from 'react';


class SpeciesList extends Component {

  constructor(props){
    super(props);
    this.data = props.data;
    this.years = Object.keys(props.data.year_totals);

    this.state = {
      year: this.years[0],
    };
  }

  processData() {
    const year_totals = this.data.year_totals[this.state.year];
    const listed_species = this.data.listed_species;
    let detected_data = year_totals.species_activity;

    let detected_species = Object.keys(detected_data)
      .reduce(function (filtered, key) {
        if (detected_data[key] > 0) filtered[key] = detected_data[key];
        return filtered;
      }, {});

    let data = {};

    for (var key in detected_species) {
      if (listed_species.indexOf(key) < 0) {
        data[key] = [detected_species[key], 'table-success'];
      } else {
        data[key] = [detected_species[key], 'table-default'];
      }
    }

    for (var i = 0; i < listed_species.length; i++) {
      let species = listed_species[i];
      if (!(species in data)) {
        data[species] = [0, 'table-warning'];
      }
    }

    return data;
  }

  buildTable() {
    let data = this.processData();

    let items = Object.keys(data).sort();
    let table_rows = items.map(
      (species, i) => (
        <tr className={data[species][1]}>
          <th scope="row">{i + 1}</th>
          <td>{species}</td>
          <td>{data[species][0]}</td>
        </tr>
      )
    );

    return (
      <table className="table table-hover">
        <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Especie</th>
            <th scope="col">Detecciones por Día (promedio)</th>
          </tr>
        </thead>
        <tbody>
          {table_rows}
        </tbody>
      </table>);
  }

  getButtons() {
    let buttons = this.years.map(
      (year) => (
        <div
          className={year === this.state.year ? 'btn btn-primary' : 'btn btn-secondary'}
          onClick={() => this.handleYearClick(year)}
          key={year}
        >
          {year}
        </div>
      )
    );

    return (
      <div className='btn-group'>
        {buttons}
      </div>
    );
  }

  handleYearClick(year) {
    this.setState({year: year});
  }

  render() {
    let table = this.buildTable();

    return (
      <div className='plot'>
        {this.getButtons()}
        {table}
      </div>);
  }
}

export default SpeciesList;
