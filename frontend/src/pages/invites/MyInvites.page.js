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
import RemoveIcon from '@material-ui/icons/Remove';


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

class MyInvitesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {"invites": []};
  }

  updateInvites = () =>
    UserService.myInvites()
      .then((invites) => this.setState({invites}));

  componentDidMount() {
    this.updateInvites();
  }

  handleAcceptInvite = (id) =>
    UserService.acceptInvite(id).then(() => this.updateInvites());

  handleDenyInvite = (id) =>
    UserService.denyInvite(id).then(() => this.updateInvites());

  render() {
    const {classes, t} = this.props;
    return (
      <div>
        <h1><Trans>My Invites</Trans></h1>
        <div>
          <table>
            <tr>
              <th><Trans>Created</Trans></th>
              <th><Trans>First Name</Trans></th>
              <th><Trans>Last Name</Trans></th>
              <th><Trans>Username</Trans></th>
              <th><Trans>Date of birthday</Trans></th>
              <th></th>
              <tr></tr>
            </tr>
            {this.state.invites.map((invite) =>
              <tr>
                <td>{new Date(invite.created).toLocaleString()}</td>
                <td>{invite.from_user.first_name}</td>
                <td>{invite.from_user.last_name}</td>
                <td>{invite.from_user.username}</td>
                <td>{new Date(invite.from_user.date_of_birthday).toLocaleDateString()}</td>
                <td>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    className={classes.button}
                    startIcon={<AddIcon/>}
                    onClick={() => this.handleAcceptInvite(invite.id)}
                  >
                    <Trans>Accept</Trans>
                  </Button>
                </td>
                <td>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    className={classes.button}
                    startIcon={<RemoveIcon/>}
                    onClick={() => this.handleDenyInvite(invite.id)}
                  >
                    <Trans>Deny</Trans>
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
  withStyles(useStyles)(withNamespaces()(MyInvitesPage))
);
