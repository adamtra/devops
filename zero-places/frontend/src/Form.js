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
            a: 1,
            b: 0,
            c: 0,
            showResult: false,
            places: [null, null],
            formValid: true,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: parseInt(value, 10),
        }, () => {
            this.setState({
                formValid: this.state.a !== 0,
            });
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
        const result = (
            <div>
                <h2>Miejsca zerowe:</h2>
                <ul>
                {this.state.places.map((place, i) => {
                    return (
                        <li key={i}>Miejsce {i + 1} = {place}</li>
                    );
                })}
                </ul>
            </div>
        );
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
                    type="number"
                    step="1"
                    value={this.state.a}
                    onChange={this.handleInputChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">a =</InputAdornment>
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
                    type="number"
                    step="1"
                    value={this.state.b}
                    onChange={this.handleInputChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">b =</InputAdornment>
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
                    type="number"
                    step="1"
                    value={this.state.c}
                    onChange={this.handleInputChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">c =</InputAdornment>
                        ),
                    }}
                    required
                />
            </form>
            <CardActions>
                <Button
                    disabled={!this.state.formValid}
                    form="function-form"
                    variant="contained"
                    type="submit"
                    color="primary"
                >
                    Oblicz miejsca zerowe
            </Button>
            </CardActions>
            {this.state.showResult ? (
                <div className="p-2">
                    {(this.state.places[0] === null || this.state.places[0] === '') ? (<h2>Brak miejsc zerowych</h2>) : result}
                </div>
            ) : null}
        </div>;
    }
}