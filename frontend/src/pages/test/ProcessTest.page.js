import React, {Component} from "react";
import {connect} from "react-redux";
import {withNamespaces} from "react-i18next";
import {withStyles} from "@material-ui/core/styles";
import {getTestDetail} from "../../actions/test";
import processTest from "../../reducers/processTest";
import TestHistoryService from "./../../services/testHistory.service";
import {createTestHistory} from "../../actions/history";
import history from "../../helpers/history";
import {INCREASE_SECONDS, INCREASE_STEP_I} from "../../actions/types";


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

class ProcessTestPage extends Component {
  constructor(props) {
    super(props);
    this.state = {interval: null};
  }

  componentDidMount() {
    const {dispatch} = this.props;
    const id = this.props.match.params.id;
    dispatch(getTestDetail(id)).then((testData) =>
      dispatch(createTestHistory(id))
        .then(() => {
          const interval = setInterval(this.tick, 1000);
          this.setState({interval});
        })
    )
  }

  tick = () => {
    const step = this.props.test.steps[this.props.process.stepI];
    const {dispatch} = this.props;
    if (this.props.process.seconds === 0) {
      TestHistoryService.addStepHistory(this.props.process.testHistoryId, step.id);
    }
    if (this.props.process.seconds === step.duration) {
      if (this.props.process.stepI + 1 === this.props.test.steps.length) {
        TestHistoryService.completeTestHistory(this.props.process.testHistoryId)
          .then(() => {
            clearInterval(this.state.interval);
            history.push("/");
          });
      } else {
        dispatch({type: INCREASE_STEP_I});
      }
    } else {
      dispatch({type: INCREASE_SECONDS});
    }
  }

  getCurrStep = () => this.props.test.steps[this.props.process.stepI];

  getImgMedia = () => <img style={{
    "max-width":"600px",
    "max-height": "500px"
  }} src={this.getCurrStep().media_file} alt="Image"/>

  getAudio = () => <audio autoPlay loop>
    <source src={this.getCurrStep().media_file}/>
  </audio>

  getVideo = () => <video width="600" height="500" autoPlay="autoplay" loop="loop">
    <source src={this.getCurrStep().media_file}/>
  </video>

  getStepMedia = () => {
    const step = this.getCurrStep();
    switch (step.media_type){
      case 1:
        return this.getImgMedia();
      case 2:
        return this.getAudio();
      case 3:
        return this.getVideo();
      default:
        return this.getImgMedia();
    }
  }

  render() {
    const {classes, t} = this.props;
    const currStep = this.getCurrStep();
    return (
      <div className={classes.root} align="center">
        <h3>{currStep.help_text}</h3>
        {this.getStepMedia()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {message} = state.message;
  return {
    message,
    test: state.test,
    process: state.processTest,
  };
};

export default connect(mapStateToProps)(
  withStyles(useStyles)(withNamespaces()(ProcessTestPage))
);
