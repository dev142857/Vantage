import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
  ReferenceArea,
  ReferenceLine,
} from "recharts";
import {
  selectOverallScoreByEndpoint,
  selectCommits,
  selectRunList,
} from "../store/dataSlice.js";
import {
  getCurrentEndpoint,
  getCurrentMetric,
  addRunValue,
} from "../store/currentViewSlice.js";
import { useSelector, useDispatch } from "react-redux";
import CustomTooltip from "./CustomTooltip.jsx";
import { useTheme } from "@mui/material/styles";
import { CatchingPokemonSharp } from "@mui/icons-material";

const OverallMetricChart = () => {
  const theme = useTheme();

  const [runA, runB] = useSelector(
    (state) => state.currentView.runValueArrSort
  );
  const dispatch = useDispatch();
  const currentEndpoint = useSelector(getCurrentEndpoint);
  const commits = useSelector(selectCommits);
  const overallScore = useSelector((state) =>
    selectOverallScoreByEndpoint(state, currentEndpoint)
  );
  const runList = useSelector(selectRunList);
  const currentMetric = useSelector(getCurrentMetric);

  const data = runList.map((cur, i) => {
    const curData = overallScore[cur];
    return {
      name: cur,
      SEO: curData.seo * 100,
      "Best Practices": curData["best-practices"] * 100,
      Performance: curData.performance * 100,
      Accessibility: curData.accessibility * 100,
    };
  });

  const sw = 2;

  const handleClick = (data) => {
    if (data) {
      dispatch(addRunValue(data.activePayload[0].payload.name));
    }
  };

  return (
    <LineChart
      onClick={handleClick}
      id='performance-chart'
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    > 
      <CartesianGrid /*horizontal={false} vertical={false}*/ />
      <XAxis dataKey={"name"} tick={false}>
        <Label value='Commits' style={{ fill: "gray" }} />
      </XAxis>
      <YAxis />
      <Tooltip content={<CustomTooltip commits={commits} />} />
      <Legend />
      {(currentMetric === "default" || currentMetric === "Performance") && (
        <Line
          type='monotone'
          dataKey='Performance'
          stroke={theme.palette.primary.main}
          strokeWidth={sw}
          dot={false}
        />
      )}
      {(currentMetric === "default" || currentMetric === "SEO") && (
        <Line
          type='monotone'
          dataKey='SEO'
          stroke={theme.palette.primary.light}
          strokeWidth={sw}
          dot={false}
        />
      )}
      {(currentMetric === "default" || currentMetric === "Best Practices") && (
        <Line
          type='monotone'
          dataKey='Best Practices'
          stroke={theme.palette.secondary.main}
          strokeWidth={sw}
          dot={false}
        />
      )}

      {(currentMetric === "default" || currentMetric === "Accessibility") && (
        <Line
          type='monotone'
          dataKey='Accessibility'
          stroke={theme.palette.secondary.light}
          strokeWidth={sw}
          dot={false}
        />
      )}
      {runB && (
        <ReferenceArea
          x1={runA}
          x2={runB}
          fill={theme.palette.primary.light}
        />
      )}
      <ReferenceLine x={runA} stroke={theme.palette.primary.light} />
      <ReferenceLine x={runB} stroke={theme.palette.primary.light} />
    </LineChart>
  );
};

export default OverallMetricChart;
