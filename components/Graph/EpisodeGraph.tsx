import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { getBestEpisode, getWorstEpisode } from './dataTools';
import { calculateMean, createLOBF } from './createLOBF';
import { SeasonEpisodeData } from '@/types/searchResult';

const margin = { top: 5, right: 10, bottom: 40, left: 40 };

const EpisodeGraph = ({
  seasonNumber,
  data,
  h,
  w,
}: {
  seasonNumber: number;
  data: SeasonEpisodeData;
  h: number;
  w: number;
}) => {
  const d3Container = useRef(null);
  const height = h - margin.top - margin.bottom;
  const width = w - margin.left - margin.right;

  useEffect(() => {
    if (d3Container.current && data) {
      d3.select(d3Container.current).selectAll('*').remove();

      const div = d3.select('div.tooltip');

      const svg = d3
        .select(d3Container.current)
        .append('g')
        .attr('class', 'text-white')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      const x = d3
        .scalePoint()
        .domain(['', ...data.map((val) => String(val.episode))])
        .range([0, width]);

      svg
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .attr('class', 'text-white')
        .call(d3.axisBottom(x));

      const y = d3.scaleLinear().domain([0, 10]).range([height, 0]);

      createLOBF(
        data.map(({ episode, rating }) => ({ x: episode, y: rating })),
        svg,
        x,
        y
      );

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
            .style(
              'left',
              (screen.width - event.clientX > 200
                ? event.clientX + 20
                : event.clientX - 140) + 'px'
            )
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
          `translate(${width / 2}, ${height + margin.top + 32})`
        )
        .style('text-anchor', 'middle')
        .attr('class', 'fill-white text-sm')
        .text('Episode');

      // Y-axis label
      svg
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - height / 2)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .attr('class', 'fill-white text-sm')
        .text('Rating');

      const handleScroll = () => {
        svg
          .selectAll('circle')
          .attr('r', 5)
          .transition()
          .duration(200)
          .attr('fill', 'white');
        div.transition().duration(200).style('opacity', 0);
      };

      document.addEventListener('scroll', handleScroll);

      return () => {
        document.removeEventListener('scroll', handleScroll);
      };
    }
  }, [data, height, width]);

  return (
    <div className="bg-blue-700 p-5 shadow-2xl rounded mb-10">
      <h2 className="text-2xl font-bold text-center text-white my-2">
        Season {seasonNumber}
      </h2>
      <svg width={w} height={h} ref={d3Container} />
      <div className="pt-4 font-bold flex flex-col md:flex-row items-center justify-evenly text-neutral-50">
        <div>Best episode: {getBestEpisode(data).number}</div>
        <div>Worst episode: {getWorstEpisode(data).number}</div>
        <div>
          Average rating:{' '}
          {calculateMean(data.map(({ rating }) => rating)).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default EpisodeGraph;
