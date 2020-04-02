import React from 'react';
import { Button, Card, CardActions, TextField } from "@material-ui/core";

export default class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: ""
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
          [name]: value
        });
    }

    render() {
        return (
          <Card className="p-2 m-2">
            <form
              id="name-form"
              className="d-flex flex-column p-2"
              autoComplete="off"
            >
              <TextField
                className="w-100"
                id="firstName"
                name="firstName"
                label="Imię"
                value={this.state.firstName}
                onChange={this.handleInputChange}
                required
              />
              <TextField
                className="w-100"
                id="lastName"
                name="lastName"
                label="Nazwisko"
                value={this.state.lastName}
                onChange={this.handleInputChange}
                required
              />
            </form>
            <CardActions>
              <Button form="name-form" variant="contained" type="submit" color="primary">
                Wyślij
              </Button>
            </CardActions>
          </Card>
        );
    }
}