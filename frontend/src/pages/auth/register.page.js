import React, { Component } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import Paper from "@material-ui/core/Paper";
import DateFnsUtils from "@date-io/date-fns";
import useStyles from "./style";
import { Link } from "react-router-dom";
import CopyrightComponent from "./copyright.component";
import Box from "@material-ui/core/Box";
import { Trans, withNamespaces } from "react-i18next";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Alert from "react-bootstrap/Alert";
import { login, register } from "../../actions/auth";
import ChangeLanguageComponent from "../common/change.lang.component";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import { CLEAR_MESSAGE } from "../../actions/types";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import AvatarUploader from "./AvatarUploader.component";


class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      first_name: "",
      last_name: "",
      user_type: 1,
      sex: 1,
      date_of_birthday: null,
      avatar: null
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDateOfBirthdayChange = this.handleDateOfBirthdayChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeAvatar = this.handleChangeAvatar.bind(this);
    const { dispatch } = this.props;
    dispatch({ type: CLEAR_MESSAGE });
  }

  handleInputChange(event) {
    console.log(event);
    const target = event.target;

    this.setState({
      [target.name]: target.value,
    });
  }

  handleDateOfBirthdayChange(newDate) {
    this.setState({
      date_of_birthday: newDate,
    });
  }

  handleChangeAvatar(newAvatar) {
    this.setState({avatar: newAvatar});
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state);
    const { dispatch, history } = this.props;
    const userData = Object.assign({}, this.state);
    const fileInfo = userData.avatar.match(/data:image\/([a-z]{2,5});base64,(.*)/);
    const buffer = new Buffer(fileInfo[2], "base64");
    const avatarFile = new File([buffer], `avatar.${fileInfo[1]}`, {type: `image/${fileInfo[1]}`});
    userData.avatar = avatarFile;
    dispatch(register(userData)).then((temp) => {
      console.log(temp);
      dispatch(login(this.state.username, this.state.password)).then(() =>
        history.push("/")
      );
    });
  }

  render() {
    const { classes, message, t } = this.props;
    const minYear = new Date(), maxYear = new Date();
    minYear.setFullYear(minYear.getFullYear() - 65);
    maxYear.setFullYear(maxYear.getFullYear() - 18);

    return (
      <div>
        <Grid container component="main" className={classes.root}>
          <CssBaseline />
          <Grid item xs={false} sm={4} md={7} className={classes.image} />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                <Trans>Sign up</Trans>
              </Typography>
              <form className={classes.form} onSubmit={this.handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      onChange={this.handleInputChange}
                      autoComplete="fname"
                      name="first_name"
                      variant="outlined"
                      required
                      fullWidth
                      id="firstName"
                      label={t("First Name")}
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      onChange={this.handleInputChange}
                      variant="outlined"
                      required
                      fullWidth
                      id="lastName"
                      label={t("Last Name")}
                      name="last_name"
                      autoComplete="lname"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      onChange={this.handleInputChange}
                      variant="outlined"
                      required
                      fullWidth
                      id="username"
                      label={t("Username")}
                      name="username"
                      autoComplete="username"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      onChange={this.handleInputChange}
                      variant="outlined"
                      required
                      fullWidth
                      name="password"
                      label={t("Password")}
                      type="password"
                      id="password"
                      autoComplete="current-password"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormControl className={classes.formControl}>
                      <InputLabel id="sex-type-select-label">
                        <Trans>Sex</Trans>
                      </InputLabel>
                      <Select
                        labelId="sex-type-select-label"
                        required
                        id="sex"
                        name="sex"
                        value={this.state.sex}
                        onChange={this.handleInputChange}
                      >
                        <MenuItem value={1}>
                          <Trans>Male</Trans>
                        </MenuItem>
                        <MenuItem value={2}>
                          <Trans>Female</Trans>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormControl className={classes.formControl}>
                      <InputLabel id="user-type-select-label">
                        <Trans>User type</Trans>
                      </InputLabel>
                      <Select
                        labelId="user-type-select-label"
                        required
                        id="user_type"
                        name="user_type"
                        value={this.state.user_type}
                        onChange={this.handleInputChange}
                      >
                        <MenuItem value={1}>
                          <Trans>Client</Trans>
                        </MenuItem>
                        <MenuItem value={2}>
                          <Trans>Psychologist</Trans>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                          // margin="normal"
                          id="date-picker-dialog"
                          name="date_of_birthday"
                          label={t("Date of birthday")}
                          format="yyyy-MM-dd"
                          minDate={minYear}
                          required
                          maxDate={maxYear}
                          value={this.state.date_of_birthday}
                          onChange={this.handleDateOfBirthdayChange}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                    />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormControl className={classes.formControl}>
                      <ChangeLanguageComponent />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} >
                    <AvatarUploader onCrop={ (avatar) => this.handleChangeAvatar(avatar) }/>
                  </Grid>
                </Grid>
                {message && (
                  <Alert key="error" variant="danger">
                    {t(message.trim())}
                  </Alert>
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  <Trans>Sign up</Trans>
                </Button>
                <Grid container justify="flex-end">
                  <Grid item>
                    <Link to="/login" variant="body2">
                      <Trans>Already have an account?</Trans>
                      <Trans>Sign in</Trans>
                    </Link>
                  </Grid>
                </Grid>
                <Box mt={5}>
                  <CopyrightComponent />
                </Box>
              </form>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

RegisterPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { isLoggedIn } = state.auth;
  const { message } = state.message;
  return {
    isLoggedIn,
    message,
  };
}

const styledComponent = withNamespaces()(withStyles(useStyles)(RegisterPage));

export default connect(mapStateToProps)(styledComponent);
