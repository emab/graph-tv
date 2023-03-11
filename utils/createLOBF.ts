import d3 from 'd3';

export const calculateMean = (values: unknown[]) =>
  values
    .map((value) => Number(value))
    .reduce((acc, next) => acc + Number(next), 0) / values.length;

const calculateLOBF = (
  values: { x: number; y: number }[]
): [{ x0: number; y0: number }, { x1: number; y1: number }] => {
  const { XValues, YValues } = values.reduce<{
    XValues: number[];
    YValues: number[];
  }>(
    (acc, { x, y }) => ({
      XValues: [...acc.XValues, Number(x)],
      YValues: [...acc.YValues, Number(y)],
    }),
    { XValues: [], YValues: [] } as { XValues: number[]; YValues: number[] }
  );

  const meanX = calculateMean(XValues);
  const meanY = calculateMean(YValues);

  let topDeriv = 0;
  let bottomDeriv = 0;

  for (let i = 0; i < values.length; i++) {
    const X = Number(XValues[i]);
    const Y = Number(YValues[i]);

    topDeriv += (X - meanX) * (Y - meanY);
    bottomDeriv += (X - meanX) * (X - meanX);
  }

  const gradient = topDeriv / bottomDeriv;

  const YIntercept = meanY - gradient * meanX;

  // y = mx + c
  // x = (y - c) / m

  // (0, Y)
  const y0 = gradient + YIntercept;

  // (lastEpisode, Y)
  const y1 = gradient * values.length + YIntercept;

  return [
    { y0, x0: 1 },
    { y1, x1: values.length },
  ];
};

export const createLOBF = (
  values: { x: number; y: number }[],
  svg: d3.Selection<SVGGElement, unknown, HTMLElement, string>,
  x: (x: number) => number | undefined,
  y: (y: number) => number,
  color: string,
  offset?: number
) => {
  const [{ x0, y0 }, { x1, y1 }] = calculateLOBF(values);

  svg
    .append('line')
    .attr('class', 'lobf')
    .style('stroke', color)
    .style('z-index', 0)
    .attr('x1', String(x(x0 + (offset ?? 0))))
    .attr('y1', y(y0))
    .attr('x2', String(x(x1 + (offset ?? 0))))
    .attr('y2', y(y1));
};
