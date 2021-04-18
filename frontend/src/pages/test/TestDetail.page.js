import React, {Component} from "react";
import {connect} from "react-redux";
import {Trans, withNamespaces} from "react-i18next";
import {withStyles} from "@material-ui/core/styles";
import {getTestDetail, updateCategories} from "../../actions/test";
import Grid from "@material-ui/core/Grid";
import {Button} from "@material-ui/core";
import CreateIcon from '@material-ui/icons/Create';


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

class TestDetailPage extends Component {
  componentDidMount() {
    const {dispatch} = this.props;
    const id = this.props.match.params.id;
    dispatch(updateCategories()).then(() => {
      dispatch(getTestDetail(id))
    });
  }

  getLangCat = () => this.props.lang === "uk-UA" ? "ukr" : "en";

  getCategories = () => {
    const cats = {};
    const catLang = this.getLangCat();
    this.props.categories.forEach((category) => {
      cats[category.id] = category[`name_${catLang}`];
    });
    return cats;
  }

  getDuration = () => this.props.test.steps.reduce(
    (accumulator, currentValue) => currentValue.duration + accumulator, 0
  );

  getFormatDuration = () => {
    const {t} = this.props;
    let duration = this.getDuration();
    const minutes = Math.trunc(duration / 60);
    const seconds = duration % 60;
    let res = `${seconds} ${t("seconds")}`
    if (minutes > 0) res = `${minutes} ${t("minutes")} ${res}`;
    return res;
  }

  render() {
    const {classes} = this.props;
    const cats = this.getCategories();

    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <img src={this.props.test.owner.avatar} height={200} width={200} alt="Avatar"/>
            <h3>{this.props.test.owner.first_name} {this.props.test.owner.last_name}</h3>
            <h3>({this.props.test.owner.username})</h3>
            <p><Trans>Birthday</Trans>: {new Date(this.props.test.owner.date_of_birthday).toLocaleDateString()}</p>
            <p><Trans>Sex</Trans>: {new Date(this.props.test.owner.date_of_birthday).toLocaleDateString()}</p>
          </Grid>
          <Grid item xs={6}>
            <h1>{this.props.test.name}</h1>
            <h4><Trans>Category</Trans>: {cats[this.props.test.category]}</h4>
            <h4><Trans>Duration</Trans>: {this.getFormatDuration()}</h4>
            <p>{this.props.test.description}</p>
            <Button
              variant="contained"
              color="primary"
              size="large"
              className={classes.button}
              startIcon={<CreateIcon/>}
              // onClick={() => this.handleDeleteTestStep(step.id)}
            >
              <Trans>Start test</Trans>
            </Button>
          </Grid>
        </Grid>
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
  withStyles(useStyles)(withNamespaces()(TestDetailPage))
);
