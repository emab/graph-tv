import React, { ReactNode, useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { createLOBF } from '@/utils/createLOBF';

const margin = { top: 5, right: 50, bottom: 20, left: 40 };

type Data = {
  x: number;
  y: number;
  extra: { name: string; season: number; actualEpisode: number };
};

type AllEpisodeGraphProps = {
  title: string;
  data: Data[][];
  xLabel: string;
  height: number;
  width: number;
  getTooltipHtml: (d: Data) => string;
  children?: ReactNode;
};

export const AllEpisodeGraph = <T,>({
  title,
  data,
  xLabel,
  height,
  width,
  getTooltipHtml,
  children,
}: AllEpisodeGraphProps) => {
  const d3Container = useRef(null);
  const graphHeight = useMemo(
    () => height - margin.top - margin.bottom,
    [height]
  );
  const graphWidth = useMemo(() => width - margin.left - margin.right, [width]);

  useEffect(() => {
    if (d3Container.current && data) {
      const flattenedData = data.flatMap((data) => data);

      d3.select(d3Container.current).selectAll('*').remove();

      const tooltip = d3.select('div.tooltip');

      const svg = d3
        .select(d3Container.current)
        .append('g')
        .attr('class', 'text-white')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      const x = d3
        .scalePoint<number>()
        .domain(flattenedData.map((val) => val.x))
        .range([0, graphWidth]);

      svg
        .append('g')
        .attr('id', 'xaxis')
        .attr('transform', `translate(0, ${graphHeight})`)
        .attr('class', 'text-white')
        .call(
          d3
            .axisBottom(x)
            .tickValues(
              d3.range(
                1,
                flattenedData.length + 1,
                Math.floor(flattenedData.length / 16)
              )
            )
        )
        .select('.domain')
        .remove();

      const y = d3.scaleLinear().domain([0, 10]).range([graphHeight, 0]);

      data.forEach((season, index) => {
        createLOBF(
          season.map((s, index) => ({ ...s, x: index + 1 })),
          svg,
          x,
          y,
          d3.schemePaired[(index + 1) % d3.schemePaired.length],
          index > 0 ? data[index - 1][data[index - 1].length - 1].x : 0
        );
      });

      svg
        .append('g')
        .attr('id', 'yaxis')
        .call(d3.axisLeft(y).tickSizeInner(-graphWidth).tickPadding(8))
        .select('.domain')
        .remove()
        .select('.tick')
        .style('opacity', '0.1');

      // add the dots with tooltips
      svg
        .selectAll('dot')
        .data(flattenedData)
        .enter()
        .append('circle')
        .attr('r', 5)
        .attr('cx', (d) => x(d.x) ?? '')
        .attr('cy', (d) => y(d.y))
        .attr(
          'fill',
          (d) => d3.schemePaired[d.extra.season % d3.schemePaired.length]
        )
        .on('mouseover', function (event, d) {
          d3.select(this).transition().duration(150).attr('r', 10);
          tooltip
            .style(
              'border',
              `3px solid ${
                d3.schemePaired[d.extra.season % d3.schemePaired.length]
              }`
            )
            .transition()
            .duration(200)
            .style('opacity', 0.9)
            .style('display', 'block');
          tooltip
            .html(getTooltipHtml(d))
            .style(
              'left',
              (window.innerWidth - event.clientX > 200
                ? event.clientX + 20
                : event.clientX - 130) + 'px'
            )
            .style('top', event.clientY - 28 + 'px')
            .style('position', 'fixed')
            .style('z-index', '10');
        })
        .on('mouseout', function () {
          d3.select(this).transition().duration(200).attr('r', 5);
          tooltip.transition().duration(500).style('opacity', 0);
        });

      // Y-axis label
      svg
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - graphHeight / 2)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .attr('class', 'fill-white text-sm')
        .style('opacity', '60%')
        .text('Rating');

      const handleScroll = () => {
        svg.selectAll('circle').transition().duration(200).attr('r', 5);
        tooltip.transition().duration(200).style('opacity', 0);
      };

      document.addEventListener('scroll', handleScroll);

      return () => {
        document.removeEventListener('scroll', handleScroll);
      };
    }
  }, [data, getTooltipHtml, graphHeight, graphWidth, xLabel]);

  return (
    <div className="bg-neutral-900 p-5 pb-0 px-0 shadow-2xl rounded mb-10">
      <h2 className="text-2xl font-bold text-center text-white my-2">
        {title}
      </h2>
      <svg width={width} height={height} ref={d3Container} className="px-5" />
      <div className="text-center mb-2 opacity-60">{xLabel}</div>
      {children}
    </div>
  );
};
