import React, {Component} from "react";
import {connect} from "react-redux";
import {Trans, withNamespaces} from "react-i18next";
import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import EditBaseTestComponent from "./EditBaseTest.component";
import {TextField} from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import Link from "@material-ui/core/Link";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import {ADD_TEST_STEP, EDIT_TEST_STEP} from "../../actions/types";
import {addStep, deleteStep, editStep} from "../../actions/steps";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';


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

class EditTestPage extends Component {
  truncUrl = (url, maxLen = 30) => {
    if (url.length <= maxLen) return url;
    url = url.split("/");
    url = url[url.length - 1];
    if (url.length > maxLen) {
      const n = maxLen / 2;
      let trunc = url.slice(0, n);
      trunc += url.slice(Math.max(url.length - n, n));
      return trunc;
    }
    return url;
  }

  handleChangeInputStep = (event) => {
    console.log(event);
    const re = /^(\d+)-(\w+)$/;
    const target = event.target;
    const match = target.name.match(re);
    const id = match[1], name = match[2];
    const {dispatch, test} = this.props;
    let value = target.value;
    if (name === "min_pulse" && value > test.steps[id].max_pulse) return;
    if (name === "max_pulse" && value < test.steps[id].min_pulse) return;
    if (name === "new_media_file") value = target.files[0];
    dispatch({type: EDIT_TEST_STEP, payload: {id, name, value}});
  }

  handleSaveTestStep = (id) => {
    const {dispatch, test} = this.props;
    const data = {...test.steps[id]};
    delete data["media_file"];
    if ("new_media_file" in data) {
      data["media_file"] = data["new_media_file"];
      delete data["new_media_file"];
    }
    console.log(data);
    if (!data.id)
      dispatch(addStep(id, data));
    else
      dispatch(editStep(id, data));
  }

  handleDeleteTestStep = (id) => {
    const {dispatch} = this.props;
    dispatch(deleteStep(id));
  }

  handleAddStep = () => {
    const emptyTest = {
      "help_text": "",
      "media_type": 1,
      "duration": 15,
      "min_pulse": 60,
      "max_pulse": 80,
      "media_file": "",
      "ps_test": this.props.match.params.id
    };
    const {dispatch} = this.props;
    dispatch({type: ADD_TEST_STEP, payload: emptyTest});
  }

  render() {
    const {classes, t} = this.props;
    const mediaTypes = {1: "image", 2: "audio", 3: "video"};
    const id = this.props.match.params.id;

    return (
      <div className={classes.root}>
        <EditBaseTestComponent id={id}/>
        <Button onClick={this.handleAddStep} variant="contained" color="primary">
          <Trans>Add test step</Trans>
        </Button>
        <table>
          <tr>
            <th>
              <Trans>Media file</Trans>
            </th>
            <th>
              <Trans>Media type</Trans>
            </th>
            <th>
              <Trans>Duration</Trans>
            </th>
            <th>
              <Trans>Min pulse</Trans>
            </th>
            <th>
              <Trans>Max pulse</Trans>
            </th>
            <th>
              <Trans>Help text</Trans>
            </th>
            <th></th>
            <th></th>
          </tr>
          {this.props.test.steps.map((step, i) =>
            <tr>
              <td>
                <Link href={step.media_file} target="_blank" variant="body2">
                  {this.truncUrl(step.media_file)}
                </Link>
                <input
                  accept={`${mediaTypes[step.media_type]}/*`}
                  className={classes.input}
                  id={`${i}-new_media_file`}
                  name={`${i}-new_media_file`}
                  onChange={this.handleChangeInputStep}
                  type="file"
                />
              </td>
              <td>
                <Select
                  required
                  id={`${i}-media_type`}
                  name={`${i}-media_type`}
                  value={step.media_type}
                  onChange={this.handleChangeInputStep}
                >
                  <MenuItem value={1}>
                    <Trans>Image</Trans>
                  </MenuItem>
                  <MenuItem value={2}>
                    <Trans>Audio</Trans>
                  </MenuItem>
                  <MenuItem value={3}>
                    <Trans>Video</Trans>
                  </MenuItem>
                </Select>
              </td>
              <td>
                <TextField
                  id={`${i}-duration`}
                  name={`${i}-duration`}
                  value={step.duration}
                  type="number"
                  onChange={this.handleChangeInputStep}
                  InputProps={{inputProps: {min: 5}}}
                  label={t("Duration")}
                  variant="outlined"
                />
              </td>
              <td>
                <TextField
                  id={`${i}-min_pulse`}
                  name={`${i}-min_pulse`}
                  value={step.min_pulse}
                  type="number"
                  onChange={this.handleChangeInputStep}
                  InputProps={{inputProps: {min: 60, max: 300}}}
                  label={t("Min pulse")}
                  variant="outlined"
                />
              </td>
              <td>
                <TextField
                  id={`${i}-max_pulse`}
                  name={`${i}-max_pulse`}
                  value={step.max_pulse}
                  type="number"
                  onChange={this.handleChangeInputStep}
                  InputProps={{inputProps: {min: 60, max: 300}}}
                  label={t("Max pulse")}
                  variant="outlined"
                />
              </td>
              <td>
                <TextField
                  id={`${i}-help_text`}
                  name={`${i}-help_text`}
                  value={step.help_text}
                  onChange={this.handleChangeInputStep}
                  type="text"
                  label={t("Help text")}
                  variant="outlined"
                />
              </td>
              <td>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  className={classes.button}
                  startIcon={<SaveIcon/>}
                  onClick={() => this.handleSaveTestStep(i)}
                >
                </Button>
              </td>
              <td>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  className={classes.button}
                  startIcon={<DeleteForeverIcon/>}
                  onClick={() => this.handleDeleteTestStep(step.id)}
                >
                </Button>
              </td>
            </tr>
          )}
        </table>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {message} = state.message;
  return {
    message,
    categories: state.category,
    lang: state.common.lang,
    test: state.test
  };
};

export default connect(mapStateToProps)(
  withStyles(useStyles)(withNamespaces()(EditTestPage))
);
