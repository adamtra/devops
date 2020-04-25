import React from 'react';
import {
    Button,
    CardActions,
    TextField,
    InputAdornment,
} from "@material-ui/core";
import axios from "axios";

export default class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            a: 0,
            b: 0,
            c: 0,
            showResult: false,
            places: [null, null],
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const result = await axios.post('/api/results', {
            a: this.state.a,
            b: this.state.b,
            c: this.state.c,
        });
        this.setState({
            places: result.data,
        });
        this.setState({
            showResult: true,
        });
    }

    render() {
        return <div>
            <form
                onSubmit={this.handleSubmit}
                id="function-form"
                className="d-flex p-2"
                autoComplete="off"
            >
                <TextField
                    className="px-2"
                    id="a"
                    name="a"
                    value={this.state.a}
                    onChange={this.handleInputChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">a=</InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="start">
                                x<sup>2</sup>
                            </InputAdornment>
                        ),
                    }}
                    required
                />
                <TextField
                    className="px-2"
                    id="b"
                    name="b"
                    value={this.state.b}
                    onChange={this.handleInputChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">b=</InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="start">x</InputAdornment>
                        ),
                    }}
                    required
                />
                <TextField
                    className="px-2"
                    id="c"
                    name="c"
                    value={this.state.c}
                    onChange={this.handleInputChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">c=</InputAdornment>
                        ),
                    }}
                    required
                />
            </form>
            <CardActions>
                <Button
                    form="function-form"
                    variant="contained"
                    type="submit"
                    color="primary"
                >
                    Oblicz miejsca zerowe
            </Button>
            </CardActions>
            {this.state.showResult ? <h2>Wysłano formularz: {this.state.places}</h2> : null}
        </div>;
    }
}