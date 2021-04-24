import React, {Component} from "react";
import {connect} from "react-redux";
import {Trans, withNamespaces} from "react-i18next";
import {withStyles} from "@material-ui/core/styles";
import UserService from "../../services/user.service";
import {TextField} from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Button from "@material-ui/core/Button";
import AddIcon from '@material-ui/icons/Add';
import history from "../../helpers/history";


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

class SearchUserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {"users": [], query: ""};
  }

  searchUser = (query = "") =>
    UserService.searchUser(query).then((users) => this.setState({users}));

  componentDidMount() {
    this.searchUser();
  }

  calculateAge = (birthday) => {
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  handleInputChange = (event) => {
    const target = event.target;
    this.setState({query: target.value});
    this.searchUser(target.value);
  }

  handleSendInvite = (id) => {
    UserService.sendInvite(id).then(() => history.push("/"));
  }

  render() {
    const {classes} = this.props;
    return (
      <div>
        <h1><Trans>Search user</Trans></h1>
        <TextField id="query" name="query" onChange={this.handleInputChange} value={this.state.query}/>
        <div>
          <table>
            <tr>
              <th><Trans>First Name</Trans></th>
              <th><Trans>Last Name</Trans></th>
              <th><Trans>Username</Trans></th>
              <th><Trans>Date of birthday</Trans></th>
              <th></th>
            </tr>
            {this.state.users.map((user) =>
              <tr>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.username}</td>
                <td>{new Date(user.date_of_birthday).toLocaleDateString()}</td>
                <td>
                  <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    className={classes.button}
                    startIcon={<AddIcon/>}
                    onClick={() => this.handleSendInvite(user.id)}
                  >
                    <Trans>Send Invite</Trans>
                  </Button>
                </td>
              </tr>
            )}
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps)(
  withStyles(useStyles)(withNamespaces()(SearchUserPage))
);
