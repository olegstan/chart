import React from 'react';
import './App.css';
import moment from 'moment';

class App extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            charts: [],
        };
        this.params = {
            symbol: 'ETH/BTC',
            resolution: 15,
            from: moment(new Date(2019, 2, 1, 0, 0, 0, 0)),
            to: moment(),
        };
    }

    loadData() {
        fetch('https://api.nacdaq.pro/plot/history?symbol=' + this.params.symbol + '&resolution=' + this.params.resolution + '&from=' + this.params.from.unix() + '&to=' + this.params.to.unix())
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                if (json.s === 'ok') {
                    let count = json.c.length;
                    let charts = this.state.charts;
                    for (var i = 0; i < count; i++) {

                        let key = charts.findIndex((obj, index, array) => {
                            return obj.time === json.t[i];
                        });

                        if (key === -1) {
                            charts.push({
                                time: json.t[i], open: json.o[i], high: json.h[i], low: json.l[i], close: json.c[i]
                            });
                        } else {
                            charts[key] = {
                                time: json.t[i], open: json.o[i], high: json.h[i], low: json.l[i], close: json.c[i]
                            };
                        }
                    }

                    this.setState({
                        charts: charts
                    });
                }
            });
    }

    componentWillMount() {
        this.loadData();

        setInterval(() => {
            this.params.from = this.params.to.subtract(this.params.resolution * 2, 'minutes');
            this.params.to = moment();

            this.loadData();
        }, 1000 * 60)
    }

    renderCharts()
    {
        return this.state.charts.map((item, key) => {
            return <div
                key={key}
                style={{
                    backgroundColor: item.open > item.close ? 'red' : 'green',
                    display: 'inline-block',
                    width: '100px',
                    border: '1px solid #000',
                    margin: '10px',
                    minHeight: '100px'
                }}
                title={'Цена открытия:' + item.low + '\n' + 'Цена закрытия: ' + item.high}>
                <div style={{
                    height: '50px',
                    display: 'flex',
                }} >{item.high}</div>
                <div style={{
                    height: '50px',
                    display: 'flex',
                    alignItems: 'flex-end',
                }} >{item.low}</div>
            </div>
        })
    }

    render() {
        return (<div style={{
            whiteSpace: 'nowrap',
            width: window.outerWidth + 'px',
            overflowX: 'auto',
            height: '150px'
        }}>
            {this.renderCharts()}
        </div>);
    }
}

export default App;
