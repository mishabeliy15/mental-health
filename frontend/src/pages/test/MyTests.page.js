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
import { DataGrid } from '@material-ui/data-grid';
import TestService from "../../services/test.service";
import Link from "@material-ui/core/Link";


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

class MyTestPage extends Component {
  constructor(props) {
    super(props);
    this.state = {tests: []};
  }
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(updateCategories())
      .then(
        TestService.myTest()
          .then((tests) => this.setState({tests}))
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

  getColumns = () => {
    const { t } = this.props;
    const cats = this.getCategories();

    const columns = [
      {
        field: 'id',
        headerName: t('ID'),
        width: 70,
        type: "number",
      },
      { field: 'name', headerName: t('Name'), width: 150 },
      { field: 'language', headerName: t('Language'), width: 70 },
      {
        field: 'category',
        headerName: t('Category'),
        width: 150,
        valueGetter: (params) => cats[params.row.category]
      },
      { field: 'description', headerName: t('Description'), width: 200},
      {
        field: 'normal_mse',
        headerName: t('Normal MSE'),
        type: 'number',
        width: 150,
      },
      {
        field: 'created',
        headerName: t('Created'),
        type: 'date',
        width: 150,
        valueGetter: (params) => new Date(params.row.created).toLocaleDateString()
      },
      {
        field: 'updated',
        headerName: t('Updated'),
        type: 'date',
        width: 150,
        valueGetter: (params) => new Date(params.row.updated).toLocaleDateString()
      },
    ];
    return columns;
  }

  onRowClick = (event, rowData) => {
    history.push(`/tests/${event.row.id}`);
  }

  render() {
    return (
      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          pageSize={5}
          columns={this.getColumns()}
          rows={this.state.tests}
          onRowClick={this.onRowClick}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {message} = state.message;
  return {
    categories: state.category,
    lang: state.common.lang,
  };
};

export default connect(mapStateToProps)(
  withStyles(useStyles)(withNamespaces()(MyTestPage))
);
