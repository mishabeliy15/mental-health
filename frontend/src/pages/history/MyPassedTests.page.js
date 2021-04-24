import React, {Component} from "react";
import {connect} from "react-redux";
import {Trans, withNamespaces} from "react-i18next";
import {withStyles} from "@material-ui/core/styles";
import {getTestDetail, updateCategories} from "../../actions/test";
import processTest from "../../reducers/processTest";
import TestHistoryService from "./../../services/testHistory.service";
import {createTestHistory} from "../../actions/history";
import history from "../../helpers/history";
import {INCREASE_SECONDS, INCREASE_STEP_I} from "../../actions/types";
import TestService from "../../services/test.service";
import {DataGrid} from "@material-ui/data-grid";


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

class MyPassedTestPage extends Component {
  constructor(props) {
    super(props);
    this.state = {"tests": []};
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(updateCategories())
      .then(
        TestHistoryService.getMyTestHistory().then((tests) => this.setState({tests}))
      );
  }

  getLangCat = () => this.props.lang === "uk-UA" ? "ukr": "en";

  getCategories = () => {
    const cats = {};
    const catLang = this.getLangCat();
    this.props.categories.forEach((category) => {
      cats[category.id] = category[`name_${catLang}`];
    });
    return cats;
  }

  calculateAge = (birthday) => {
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  getColumns = () => {
    const { t } = this.props;
    const cats = this.getCategories();
    const statuses = {1: t("IN PROGRESS"), 2: t("COMPLETED"), 3: t("NOT COMPLETED")};
    const columns = [
      {
        field: 'id',
        headerName: t('ID'),
        width: 70,
        type: "number",
      },
      {
        field: 'status',
        headerName: t('Status'),
        width: 130,
        valueGetter: (params) => statuses[params.row.status]
      },
      { field: 'name', headerName: t('Name'), width: 150, valueGetter: (params) => params.row.test.name },
      { field: 'language', headerName: t('Language'), width: 70, valueGetter: (params) => params.row.test.language },
      {
        field: 'category',
        headerName: t('Category'),
        width: 150,
        valueGetter: (params) => cats[params.row.test.category]
      },
      { field: 'description', headerName: t('Description'), width: 200, valueGetter: (params) => params.row.test.description},
      {
        field: 'normal_mse',
        headerName: t('MSE'),
        type: 'number',
        width: 70,
        valueGetter: (params) => params.row.test.normal_mse
      },
      {
        field: 'owner',
        headerName: t('Owner'),
        width: 170,
        valueGetter: (params) => `${params.row.test.owner.first_name} ${params.row.test.owner.last_name}`
      },
      {
        field: 'age',
        headerName: t('Age'),
        type: 'number',
        width: 70,
        valueGetter: (params) => this.calculateAge(new Date(params.row.test.owner.date_of_birthday))
      },
      {
        field: 'created',
        headerName: t('Started'),
        type: 'date',
        width: 190,
        valueGetter: (params) => new Date(params.row.created).toLocaleString()
      },
      {
        field: 'updated',
        headerName: t('Ended'),
        type: 'date',
        width: 190,
        valueGetter: (params) => new Date(params.row.updated).toLocaleString()
      },
    ];
    return columns;
  }

  render() {
    return (
      <div>
        <h1><Trans>My passed tests</Trans></h1>
        <div style={{ height: 500, width: '100%' }}>
          <DataGrid
            pageSize={5}
            columns={this.getColumns()}
            rows={this.state.tests}
            loading={!this.state.tests.length}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    categories: state.category,
    lang: state.common.lang,
  };
};

export default connect(mapStateToProps)(
  withStyles(useStyles)(withNamespaces()(MyPassedTestPage))
);
