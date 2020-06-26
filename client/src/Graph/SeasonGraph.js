import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { Grid } from 'semantic-ui-react';
import { getBestSeason, getWorstSeason } from './dataTools';

const SeasonGraph = ({ data, h, w }) => {
  const d3Container = useRef(null);
  const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    height = h - margin.top - margin.bottom,
    width = w - margin.left - margin.right;

  useEffect(() => {
    if (d3Container.current && data) {
      const svg = d3
        .select(d3Container.current)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      svg.selectAll('g').remove();

      const x = d3
        .scalePoint()
        .domain(data.map((val) => val.season))
        .range([0, width]);
      svg
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x));

      const y = d3.scaleLinear().domain([0, 10]).range([height, 0]);
      svg.append('g').call(d3.axisLeft(y));

      svg
        .append('g')
        .selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d) => x(d.season))
        .attr('cy', (d) => y(d.rating))
        .attr('r', 4)
        .style('fill', 'steelblue');

      // X-axis label
      svg
        .append('text')
        .attr(
          'transform',
          `translate(${width / 2}, ${height + margin.top + 18})`
        )
        .style('text-anchor', 'middle')
        .text('Season');

      // Y-axis label
      svg
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - height / 2)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Rating');
    }
  }, [data]);

  return (
    <Grid centered columns={3} verticalAlign="middle">
      <Grid.Row>
        <Grid.Column>
          <svg width={w} height={h} ref={d3Container}></svg>
        </Grid.Column>
        <Grid.Column width={3}>
          <p>Best season: {getBestSeason(data).number}</p>
          <p>Worst season: {getWorstSeason(data).number}</p>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default SeasonGraph;
