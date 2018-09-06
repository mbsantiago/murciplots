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
    const listed_species = this.data.listed_species;

    const year_totals = this.data.year_totals[this.state.year];
    const detected_data = year_totals.species_activity.mean;
    const all_species = Object.keys(detected_data);

    for (var i = 0; i < listed_species.length; i++) {
      if (all_species.indexOf(listed_species[i]) < 0) {
        console.log('Unknown listed species');
      }
    }

    let all_data = {};
    for (var j = 0; j < all_species.length; j++) {
      for (var k = 0; k < this.years.length; k ++) {
        let year = this.years[k];
        let species = all_species[j];
        let mean_value = this.data.year_totals[year].species_activity.mean[species];
        let q25_value = this.data.year_totals[year].species_activity.q25[species];
        let q75_value = this.data.year_totals[year].species_activity.q75[species];

        if (!(species in all_data)) {
          let is_listed = (listed_species.indexOf(species) >= 0);
          all_data[species] = {is_listed: is_listed};
        }
        all_data[species][year] = {q25: q25_value, q75: q75_value, mean: mean_value};
      }
    }

    let data = Object.keys(all_data).reduce(
      (filtered, key) => {
        if (all_data[key].is_listed) {
          filtered[key] = all_data[key];
          return filtered;
        }
        for (var l = 0; l < this.years.length; l++) {
          if (all_data[key][this.years[l]].mean > 0) {
            filtered[key] = all_data[key];
            return filtered;
          }
        }

        return filtered;
      }, {});
    return data;
  }

  getCounts(data) {
    let counts = {};

    for (var i=0; i < this.years.length; i++) {
      let year = this.years[i];
      counts[year] = {};

      let num_listed = 0;
      let num_unlisted = 0;
      for (var species in data) {
        if (data[species][year] > 0) {
          if (data[species].is_listed) {
            num_listed++;
          } else {
            num_unlisted++;
          }
        }
      }
    }

  }

  buildTable() {
    let data = this.processData();

    let items = Object.keys(data).sort();

    let get_year_rows = (species) => {
      let rows = this.years.map(
        (year) => {

          return ['q25', 'mean', 'q75'].map(
            (key) => {
              let className;
              let value = data[species][year][key];

              if (data[species].is_listed) {
                className = value === 0 ? 'text-info' : '';
              } else {
                className = value === 0 ? '' : 'text-success';
              }

              return <td key={year + species + key} className={className}>{value}</td>;
            }
          );
        }
      );
      return rows;
    };

    let table_rows = items.map(
      (species, i) => (
        <tr key={'row' + species} className={data[species].is_listed ? 'table-default' : 'table-secondary'}>
          <th scope="row">{i + 1}</th>
          <th>{species}</th>
          {get_year_rows(species)}
        </tr>
      )
    );

    let headers = this.years.map(
      (year) => <th scope="col" key={'col' + year} colspan={3}>{year}</th>
    );

    let subheaders = this.years.map(
      (year) => (
          ['25%', 'media', '75%'].map(
            (type) => <td scope="col" key={'col' + year + type}>{type}</td>
          )
      )
    );

    return (
      <table className="table table-hover">
        <thead className="thead-dark">
          <tr>
            <th scope="col" rowspan={2}>#</th>
            <th scope="col" rowspan={2}>Especie</th>
            {headers}
          </tr>
          {subheaders}
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

  render() {
    let table = this.buildTable();

    return (
      <div className='plot'>
        {table}
      </div>);
  }
}

export default SpeciesList;
