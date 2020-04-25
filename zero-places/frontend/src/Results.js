import React from 'react';
import { 
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    CircularProgress,
} from "@material-ui/core";
import axios from "axios";

const columns = [
    { id: 'a', label: 'A'},
    { id: 'b', label: 'B'},
    { id: 'c', label: 'C'},
    { id: 'p1', label: 'Miejsce 1'},
    { id: 'p2', label: 'Miejsce 2'},
];

export default class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            showTable: false,
        };
        this.getResults = this.getResults.bind(this);
    }

    componentDidMount() {
        this.getResults();
    }

    getResults = async () => {
        const results = await axios.get('/api/results');
        this.setState({
            results: results.data,
            showTable: true,
        });
    }

    render() {
        const table = (
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.results.map((row) => {
                            return (
                                <TableRow hover role="checkbox" key={`${row.a},${row.b},${row.c}`} tabIndex={-1}>
                                    {columns.map((column) => {
                                        return (
                                            <TableCell key={column.id}>
                                                {row[column.id]}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        )
        const loader = <CircularProgress className="loader mx-auto my-2" color="secondary" />;
        return (
        <div className="d-flex">
            {this.state.showTable ? table : loader}
        </div>
        );
    }
}