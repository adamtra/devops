import React from 'react';
import { Card, Tabs, Tab, AppBar } from "@material-ui/core";
import Form from './Form';
import Results from './Results';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, newValue) {
    this.setState({
      index: newValue,
    });
  }

  render() {
    return <Card className="p-2 m-2">
      <AppBar position="static">
        <Tabs
          value={this.state.index}
          onChange={this.handleChange}
          indicatorColor="secondary">
          <Tab label="Oblicz" />
          <Tab label="Historia wyników" />
        </Tabs>
      </AppBar>
        {this.state.index === 0 && <Form />}
        {this.state.index === 1 && <Results />}
        
      </Card>;
  }
}