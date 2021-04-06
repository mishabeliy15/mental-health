import React, {Component} from "react";
import {connect} from "react-redux";
import {Trans, withNamespaces} from "react-i18next";
import Grid from "@material-ui/core/Grid";
import {withStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Alert from "react-bootstrap/Alert";
import {createTest, updateCategories} from "../../actions/test";
import history from "../../helpers/history";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

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

class AddTestPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      language: null,
      category: "",
      description: "",
      normal_mse: ""
    };
    const {dispatch} = this.props;
    dispatch(updateCategories());
  }

  handleInputChange = (event) => {
    const target = event.target;

    this.setState({
      [target.name]: target.value,
    });
  };

  handleOnSubmit = (event) => {
    event.preventDefault();
    console.log(this.state);
    const {dispatch} = this.props;
    dispatch(createTest(this.state))
      .then(
        (test) => history.push(`/tests/${test.id}/edit/`)
      );
  };

  render() {
    const {classes, t, lang} = this.props;
    let cat_lang = "en";
    if (lang === "uk-UA") cat_lang = "ukr";

    return (
      <div className={classes.root}>
        <form onSubmit={this.handleOnSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <TextField
                required
                id="test-name"
                label={t("Name")}
                value={this.state.name}
                onChange={this.handleInputChange}
                name="name"
                fullWidth={true}
                autoComplete={t("Test name")}
                helperText={this.props.message && this.props.message.name}
                error={this.props.message && this.props.message.name}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                id="description-name"
                label={t("Description")}
                multiline
                value={this.state.description}
                onChange={this.handleInputChange}
                name="description"
                fullWidth={true}
                rows={4}
                autoComplete={t("Description")}
                helperText={this.props.message && this.props.message.description}
                error={this.props.message && this.props.message.description}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel id="language-select-label">
                <Trans>Language</Trans>
              </InputLabel>
              <Select
                labelId="language-select-label"
                required
                id="language"
                name="language"
                value={this.state.language}
                onChange={this.handleInputChange}
              >
                <MenuItem value={"EN"}>
                  <Trans>English</Trans>
                </MenuItem>
                <MenuItem value={"UKR"}>
                  <Trans>Ukrainian</Trans>
                </MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel id="category-select-label">
                <Trans>Category</Trans>
              </InputLabel>
              <Select
                labelId="category-select-label"
                required
                id="category"
                name="category"
                value={this.state.category}
                onChange={this.handleInputChange}
              >
                {this.props.categories.map((category) =>
                  <MenuItem value={category.id}>
                    {category[`name_${cat_lang}`]}
                  </MenuItem>
                )}
              </Select>
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField
                required
                id="normal-mse"
                label={t("Normal MSE")}
                value={this.state.normal_mse}
                onChange={this.handleInputChange}
                type="number"
                InputProps={{ inputProps: { min: 1 } }}
                name="normal_mse"
                fullWidth={true}
                autoComplete={t("Normal MSE")}
                helperText={this.props.message && this.props.message.normal_mse}
                error={this.props.message && this.props.message.normal_mse}
              />
            </Grid>

            {this.props.message && this.props.message.non_field_errors && (
              <Grid item xs={12}>
                <Alert key="error" variant="danger">
                  {this.props.message.non_field_errors.join("\n")}
                </Alert>
              </Grid>
            )}
            <Grid item xs={4}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                <Trans>Add</Trans> <Trans>company</Trans>
              </Button>
            </Grid>
          </Grid>
        </form>
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
  };
};

export default connect(mapStateToProps)(
  withStyles(useStyles)(withNamespaces()(AddTestPage))
);
