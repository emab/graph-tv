import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import * as d3 from 'd3';
import { createLOBF } from '@/utils/createLOBF';
import { getBest, getWorst, normalizer } from '@/utils/dataTools';

const margin = { top: 5, right: 50, bottom: 20, left: 40 };

type Data<T> = { x: number; y: number; extra: T };

type GraphProps<T> = {
  title: string;
  data: Data<T>[];
  xLabel: string;
  height: number;
  width: number;
  getTooltipHtml: (d: Data<T>) => string;
  id?: string;
  children?: ReactNode;
};

export const Graph = <T,>({
  title,
  data,
  xLabel,
  height,
  width,
  getTooltipHtml,
  id,
  children,
}: GraphProps<T>) => {
  const d3Container = useRef(null);
  const graphHeight = useMemo(
    () => height - margin.top - margin.bottom,
    [height]
  );
  const graphWidth = useMemo(() => width - margin.left - margin.right, [width]);

  const worstRating = useMemo(
    () =>
      getWorst<Data<T> & { rating: number }>('x')(
        data.map((data) => ({ ...data, rating: data.y }))
      ).rating,
    [data]
  );

  const bestRating = useMemo(
    () =>
      getBest<Data<T> & { rating: number }>('x')(
        data.map((data) => ({ ...data, rating: data.y }))
      ).y,
    [data]
  );

  const normalizeRating = useCallback(
    (rating: number) => normalizer(worstRating, bestRating)(rating) / 1.2,
    [bestRating, worstRating]
  );

  useEffect(() => {
    if (d3Container.current && data) {
      d3.select(d3Container.current).selectAll('*').remove();

      const tooltip = d3.select('div.tooltip');

      const svg = d3
        .select(d3Container.current)
        .append('g')
        .attr('class', 'text-white')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      const x = d3
        .scalePoint<number>()
        .domain(data.map((val) => val.x))
        .range([0, graphWidth]);

      svg
        .append('g')
        .attr('id', 'xaxis')
        .attr('transform', `translate(0, ${graphHeight})`)
        .attr('class', 'text-white')
        .call(
          d3
            .axisBottom(x)
            .tickValues(d3.range(1, data.length + 1, data.length > 15 ? 4 : 1))
        )
        .select('.domain')
        .remove();

      const y = d3.scaleLinear().domain([0, 10]).range([graphHeight, 0]);

      createLOBF(data, svg, x, y, 'white');

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
        .data(data)
        .enter()
        .append('circle')
        .attr('r', 5)
        .attr('cx', (d) => x(d.x) ?? '')
        .attr('cy', (d) => y(d.y))
        .attr('fill', (d) => d3.interpolateRdBu(normalizeRating(d.y)))
        .on('mouseover', function (event, d) {
          d3.select(this).attr('r', 10);
          tooltip
            .style('border-color', d3.interpolateRdBu(normalizeRating(d.y)))
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
          d3.select(this).attr('r', 5);
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
        svg.selectAll('circle').attr('r', 5).transition().duration(200);
      };

      document.addEventListener('scroll', handleScroll);

      return () => {
        document.removeEventListener('scroll', handleScroll);
      };
    }
  }, [data, getTooltipHtml, graphHeight, graphWidth, normalizeRating, xLabel]);

  return (
    <div
      id={id}
      className="bg-neutral-900 p-5 pb-0 px-0 shadow-2xl rounded mb-10"
    >
      <h2 className="text-2xl font-bold text-center text-white my-2">
        {title}
      </h2>
      <svg width={width} height={height} ref={d3Container} className="px-5" />
      <div className="text-center mb-2 opacity-60">{xLabel}</div>
      {children}
    </div>
  );
};
