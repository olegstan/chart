import React from 'react';
import './App.css';
import moment from 'moment';

class App extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            charts: [],
            maxHeight: 0
        };
        this.params = {
            symbol: 'ETH/BTC',
            resolution: 15,
            from: moment(new Date(2019, 2, 1, 0, 0, 0, 0)),
            to: moment(),
            maxHeight: 0,
        };
    }

    loadData()
    {
        fetch('https://api.nacdaq.pro/plot/history?symbol=' + this.params.symbol + '&resolution=' + this.params.resolution + '&from=' + this.params.from.unix() + '&to=' + this.params.to.unix())
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                if (json.s === 'ok') {
                    let count = json.c.length;
                    let charts = this.state.charts;
                    let maxHeight = this.state.maxHeight;
                    for (var i = 0; i < count; i++)
                    {
                        if(maxHeight < json.v[i])
                        {
                            maxHeight = json.v[i];
                        }


                        let key = charts.findIndex((obj, index, array) => {
                            return obj.time === json.t[i];
                        });

                        if (key === -1) {
                            charts.push({
                                time: json.t[i], open: json.o[i], high: json.h[i], low: json.l[i], close: json.c[i], value: json.v[i]
                            });
                        } else {
                            charts[key] = {
                                time: json.t[i], open: json.o[i], high: json.h[i], low: json.l[i], close: json.c[i], value: json.v[i]
                            };
                        }
                    }

                    this.setState({
                        charts: charts,
                        maxHeight: maxHeight
                    });
                }else{
                    alert('Ошибка загрузки');
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
                dataValue={item.value}
                style={{
                    backgroundColor: item.open > item.close ? 'red' : 'green',
                    display: 'inline-block',
                    width: '3px',
                    margin: '1px',
                    height: (item.value * 3) + 'px'
                }}>
            </div>
        })
    }

    render() {
        return (<div style={{
            whiteSpace: 'nowrap',
            width: window.outerWidth + 'px',
            height: '800px',
            overflowX: 'auto',
        }}>
            {this.renderCharts()}
        </div>);
    }
}

export default App;
