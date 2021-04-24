import { Trans, withNamespaces } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import LogOutComponent from "./auth/logout.component";
import ChangeLanguageComponent from "./common/change.lang.component";
import React, { Component } from "react";
import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
// import DashboardIcon from "@material-ui/icons/Dashboard";
import withTheme from "@material-ui/core/styles/withTheme";
import { Redirect, Router, Switch } from "react-router";
import { Link, Route } from "react-router-dom";
import { default as HrefLink } from "@material-ui/core/Link";
import history from "../helpers/history";
import useStyles from "./main.page.style";
import AddIcon from "@material-ui/icons/Add";
import ListIcon from '@material-ui/icons/List';
import AddTestPage from "./test/AddTest.page";
import EditTestPage from "./test/EditTest.page";
import MyTestPage from "./test/MyTests.page";
import TestsPage from "./test/Tests.page";
import TestDetailPage from "./test/TestDetail.page";
import ProcessTestPage from "./test/ProcessTest.page";
import MyPassedTestPage from "./history/MyPassedTests.page";
import ArchiveIcon from '@material-ui/icons/Archive';

const userTypeNavigationListItem = {
  1: [
    {
      name: "Tests",
      icon: <ListIcon />,
      url: "/tests",
    },
    {
      name: "My passed tests",
      icon: <ArchiveIcon />,
      url: "/tests/my",
    },
  ],
  2: [
    {
      name: "Add test",
      icon: <AddIcon />,
      url: "/tests/add",
    },
    {
      name: "My tests",
      icon: <ListIcon />,
      url: "/tests/my",
    },
  ],
};

const userTypeSwitchRoutes = {
  1: (
    <Switch>
      <Route exact path="/">
        <Redirect to="/tests"/>
      </Route>
      <Route exact path="/tests" component={TestsPage} />
      <Route exact path="/tests/my" component={MyPassedTestPage}/>
      <Route exact path="/tests/:id/process" component={ProcessTestPage} />
      <Route exact path="/tests/:id" component={TestDetailPage} />
    </Switch>
  ),
  2: (
    <Switch>
      <Route exact path="/">
        <Redirect to="/tests/my"/>
      </Route>
      <Route exact path="/tests/add">
        <AddTestPage />
      </Route>
      <Route exact path="/tests/my" component={MyTestPage} />
      <Route path="/tests/:id" component={EditTestPage} />
    </Switch>
  ),
};

class MainComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
  }

  handleDrawerOpen = () => {
    this.setState({ isOpen: true });
  };

  handleDrawerClose = () => {
    this.setState({ isOpen: false });
  };

  render() {
    const { classes, theme, t } = this.props;
    const userType = this.props.user.user_type;
    const navigationItems = userTypeNavigationListItem[userType];
    const pathname = history.location.pathname;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: this.state.isOpen,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: this.state.isOpen,
              })}
            >
              <MenuIcon />
            </IconButton>
            <ChangeLanguageComponent />
            <HrefLink href="/admin/" color="inherit" className="MuiLink-button">
              <Trans>Admin panel</Trans>
            </HrefLink>
            <LogOutComponent color="inherit" className={classes.panelButton} />
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: this.state.isOpen,
            [classes.drawerClose]: !this.state.isOpen,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: this.state.isOpen,
              [classes.drawerClose]: !this.state.isOpen,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <List>
            {navigationItems.map((item) => (
              <ListItem
                selected={item.url === pathname}
                button
                key={item.name}
                component={Link}
                to={item.url}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={t(item.name)} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Router history={history}>
            {userTypeSwitchRoutes[userType]}
          </Router>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { user } = state.auth;
  return { user };
};

const styledComponent = withNamespaces()(
  withTheme(withStyles(useStyles)(MainComponent))
);

export default connect(mapStateToProps)(styledComponent);
