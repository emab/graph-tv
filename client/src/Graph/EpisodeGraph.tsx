import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { getBestEpisode, getWorstEpisode } from './dataTools';
import { EpisodeData } from '../types';
import style from './Graph.module.css';

const EpisodeGraph = ({
  data,
  h,
  w,
}: {
  data: EpisodeData[];
  h: number;
  w: number;
}) => {
  const d3Container = useRef(null);
  const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    height = h - margin.top - margin.bottom,
    width = w - margin.left - margin.right;

  useEffect(() => {
    if (d3Container.current && data) {
      d3.select(d3Container.current).selectAll('*').remove();

      const div = d3.select('div.tooltip');

      const svg = d3
        .select(d3Container.current)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      const x = d3
        .scalePoint()
        .domain(['', ...data.map((val) => String(val.episode))])
        .range([0, width]);

      svg
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x));

      const y = d3.scaleLinear().domain([0, 10]).range([height, 0]);

      svg.append('g').call(d3.axisLeft(y));

      // add the dots with tooltips
      svg
        .selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('r', 5)
        .attr('cx', (d) => x(String(d.episode)) ?? '')
        .attr('cy', (d) => y(Number(d.rating)))
        .attr('fill', 'white')
        .on('mouseover', function (event, d) {
          d3.select(this).attr('r', 10).attr('fill', '#4778de');
          div.transition().duration(200).style('opacity', 0.9);
          div
            .html('Episode: ' + d.episode + '<br/>' + 'Rating: ' + d.rating)
            .style('left', event.clientX + 20 + 'px')
            .style('top', event.clientY - 28 + 'px')
            .style('position', 'fixed')
            .style('z-index', '10');
        })
        .on('mouseout', function () {
          d3.select(this).attr('r', 5).attr('fill', 'white');
          div.transition().duration(500).style('opacity', 0);
        });

      // X-axis label
      svg
        .append('text')
        .attr(
          'transform',
          `translate(${width / 2}, ${height + margin.top + 18})`
        )
        .style('text-anchor', 'middle')
        .text('Episode');

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
  }, [data, height, margin, width]);

  return (
    <div>
      <div className={style.container}>
        <svg width={w} height={h} ref={d3Container} />
      </div>
      <div className={style.container}>
        <div className="flex justify-center">
          Best episode: {getBestEpisode(data).number}
        </div>
        <div className="flex justify-center">
          Worst episode: {getWorstEpisode(data).number}
        </div>
      </div>
    </div>
  );
};

export default EpisodeGraph;
