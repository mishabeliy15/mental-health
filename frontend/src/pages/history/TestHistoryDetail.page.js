import React, {Component} from "react";
import {connect} from "react-redux";
import {Trans, withNamespaces} from "react-i18next";
import {withStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Plot from 'react-plotly.js';
import TestHistoryService from "./../../services/testHistory.service";


const useStyles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
});

class TestHistoryDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {detail: null};
  }
  componentDidMount() {
    const id = this.props.match.params.id;
    TestHistoryService.getDetailHistory(id).then((detail) => this.setState({detail}));
  }

  getImgMedia = (media_file) => <img style={{
    "max-width":"400px",
    "max-height": "300px"
  }} src={media_file} alt="Image"/>

  getAudio = (media_file) => <audio controls="controls">
    <source src={media_file}/>
  </audio>

  getVideo = (media_file) => <video controls="controls" width="300" height="300">
    <source src={media_file}/>
  </video>

  getStepMedia = (step) => {
    switch (step.media_type){
      case 1:
        return this.getImgMedia(step.media_file);
      case 2:
        return this.getAudio(step.media_file);
      case 3:
        return this.getVideo(step.media_file);
      default:
        return this.getImgMedia(step.media_file);
    }
  }

  getFormatDuration = (duration) => {
    const {t} = this.props;
    const minutes = Math.trunc(duration / 60);
    const seconds = duration % 60;
    let res = `${seconds} ${t("seconds")}`
    if (minutes > 0) res = `${minutes} ${t("minutes")} ${res}`;
    return res;
  }

  timeDif = (startDate, endDate) => (endDate.getTime() - startDate.getTime()) / 1000;


  getGeneralPlot = () => {
    let x = [], y = [];
    let x_min = [], y_min = [];
    let x_max = [], y_max = [];
    let duration = 0;
    this.state.detail.step_history.forEach((step) => {
      const startDate = new Date(step.started_at);
      step.pulses.forEach((pulse) => {
        const dif = Math.round(this.timeDif(startDate, new Date(pulse.created)));
        x.push(duration + dif);
        y.push(pulse.pulse);
      });
      x_min.push(duration);
      x_max.push(duration);
      y_min.push(step.step.min_pulse);
      y_max.push(step.step.max_pulse);
      duration += step.step.duration;
      x_min.push(duration);
      x_max.push(duration);
      y_min.push(step.step.min_pulse);
      y_max.push(step.step.max_pulse);
    });
    const {t} = this.props;
    return <Plot
      data={[
        {
          name: t("Pulse"),
          type: 'scatter',
          mode: 'lines+markers',
          x,
          y,
        },
        {
          name: t("Min pulse"),
          x: x_min,
          y: y_min,
          type: 'scatter',
          mode: 'lines',
          marker: {color: 'green'},
        },
        {
          name: t("Max pulse"),
          x: x_max,
          y: y_max,
          type: 'scatter',
          mode: 'lines',
          marker: {color: 'red'},
        },
      ]}
      layout={{
        width: 1000,
        height: 500,
        title: t('General Pulse Plot'),
        xaxis: {
          title: {
            text: t('Time (s.)'),
          },
        },
        yaxis: {
          title: {
            text: t('Pulse'),
          },
        }
      }}
    />
  }


  getStepPlot = (step) => {
    let x = [], y = [];
    let x_min = [0, step.step.duration], y_min = [step.step.min_pulse, step.step.min_pulse];
    let x_max = [0, step.step.duration], y_max = [step.step.max_pulse, step.step.max_pulse];
    const startDate = new Date(step.started_at);
    step.pulses.forEach((pulse) => {
        const dif = Math.round(this.timeDif(startDate, new Date(pulse.created)));
        x.push(dif);
        y.push(pulse.pulse);
    });
    const {t} = this.props;
    return <Plot
      data={[
        {
          name: t("Pulse"),
          type: 'scatter',
          mode: 'lines+markers',
          x,
          y,
        },
        {
          name: t("Min pulse"),
          x: x_min,
          y: y_min,
          type: 'scatter',
          mode: 'lines',
          marker: {color: 'green'},
        },
        {
          name: t("Max pulse"),
          x: x_max,
          y: y_max,
          type: 'scatter',
          mode: 'lines',
          marker: {color: 'red'},
        },
      ]}
      layout={{
        width: 500,
        height: 300,
        title: t('Pulse Plot'),
        xaxis: {
          title: {
            text: t('Time (s.)'),
          },
        },
        yaxis: {
          title: {
            text: t('Pulse'),
          },
        }
      }}
    />
  }



  getGeneralMSE = () => {
    const mse = Math.round(this.state.detail.mse * 100) / 100;
    let sign = "<", color = "green";
    if (mse > this.state.detail.test.normal_mse) {
      sign = ">";
      color = "red";
    }
    return <h2 align="center" style={{color}}>MSE: {mse} {sign} {this.state.detail.test.normal_mse}</h2>
  }

  render() {
    const {classes, t} = this.props;
    if (!this.state.detail) return <div></div>

    return (
      <div className={classes.root}>
        <h1 align="center">{this.state.detail.test.name}</h1>
        {this.getGeneralMSE()}
        {this.getGeneralPlot()}
          {this.state.detail.step_history.map((step_history) => <Grid container spacing={3}>
            <Grid item xs={4}>
              <h3><Trans>Duration</Trans>: {this.getFormatDuration(step_history.step.duration)}</h3>
              {this.getStepMedia(step_history.step)}
            </Grid>
            <Grid item xs={8}>
              {this.getStepPlot(step_history)}
            </Grid>
          </Grid>)}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {message} = state.message;
  return {
    message,
    lang: state.common.lang,
  };
};

export default connect(mapStateToProps)(
  withStyles(useStyles)(withNamespaces()(TestHistoryDetailPage))
);
