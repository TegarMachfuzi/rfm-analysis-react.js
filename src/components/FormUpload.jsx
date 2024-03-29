import React, { Component } from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)
class FormUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],     // Data CSV yang akan dibaca
            bestMonetary: null,
            bestFrequency: undefined,
            bestRecency: undefined,
            segmentCust: undefined,
            championsCount: [],
            loyalCostumersCount: [],
            atRiskCustomers: [],
        };
    }

    parseCSVData = (csvText) => {
        const rows = csvText.split('\n');
        const customerData = rows.map((row, index) => {
            if (index === 0) return null; // Melewatkan baris header

            const [CustId, Name, Date, Items, NetSales, SalesType] = row.split(',');
            return {
                CustomerID: parseInt(CustId, 10),
                Name,
                Date,
                Items,
                SalesType,
                NetSales: parseFloat(NetSales),
            };
        }).filter(Boolean); // Menghapus baris kosong (header)

        return customerData;
    };


    handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const csvText = e.target.result;
                const customerData = this.parseCSVData(csvText);
                this.calculateRFM(customerData);
                // this.calculateFrequency(customerData);
            };

            reader.readAsText(file);
        }
    };


    calculateRFM = (customerData) => {
        const filtered = []
        customerData.forEach(item => {
            const exist = filtered.find(f => f.CustomerID === item.CustomerID)
            if (!exist && item.CustomerID) {
                const { CustomerID, Name, ..._dump } = item
                filtered.push({ CustomerID, Name })
            }
        })


        const result = filtered.map(item => {
            const arrFilter = customerData.filter(f => f.CustomerID === item.CustomerID)
            const largest = arrFilter.reduce((prev, val) => {
                if (!prev) return val
                const prevDiffDays = this.calculateDifferenceDays(prev.Date)
                const currentDiffDays = this.calculateDifferenceDays(val.Date)
                return prevDiffDays < currentDiffDays ? prev : val
            }, undefined)
            const Recency = this.calculateDifferenceDays(largest.Date)
            const Frequency = arrFilter.length;
            const Monetary = arrFilter.reduce((prev, next) => prev + next.NetSales, 0)
            const Tertinggi = arrFilter.reduce((pelangganTertinggi, customer) => pelangganTertinggi > customer.NetSales ? pelangganTertinggi : customer.NetSales, 0)

            console.log('data Monetary', Monetary);

            return {
                ...item,
                Recency,
                Frequency,
                Monetary,
                Tertinggi
            }
        })


        // const valMonetary = result.reduce((prev, next) => {
        //     if (next.Monetary > prev) {
        //         return next.Monetary;
        //     }
        //     return prev;
        // }, 0);
        // console.log('Top Mon', valMonetary)



        //calculate best monetary
        const valMonetary = result.reduce((prev, next) => {
            if (!prev) return next
            console.log('nextMon', next.Monetary)
            return next.Monetary > prev.Monetary ? next : prev
        }, undefined)
        console.log('Top Mon', valMonetary);

        const valFrequency = result.reduce((prev, next) => {
            if (!prev) return next
            return prev.Frequency > next.Frequency ? prev : next
        }, undefined)


        const valRecency = result.reduce((prev, next) => {
            if (!prev) return next
            return prev.Recency < next.Recency ? prev : next
        }, undefined)

        console.log('Pelanggan Royal', valMonetary);

        const champions = [];
        const loyalCustomers = [];
        const atRiskCustomers = [];
        const resultData = result.forEach(customer => {
            if (customer.Recency <= 130 && customer.Frequency >= 20 && customer.Monetary >= 700000) {
                champions.push(customer);
            } else if (customer.Recency <= 150 && customer.Frequency >= 18 && customer.Monetary >= 200000) {
                loyalCustomers.push(customer);
            } else {
                atRiskCustomers.push(customer);
            }
            console.log('chamionsCek', champions);

            const championsCount = champions.length;
            const loyalCostumersCount = loyalCustomers.length;
            const atRiskCustomersCount = atRiskCustomers.length;

            const topChampionsCustomer = loyalCustomers.slice(0, 5);

            console.log('5 loyal Data', topChampionsCustomer);

            console.log('loyalCustomer', loyalCostumersCount)

            console.log('champions', championsCount);

            this.setState({ championsCount: championsCount, loyalCostumersCount: loyalCostumersCount, atRiskCustomersCount: atRiskCustomersCount })
        });



        this.setState({ data: result, bestMonetary: valMonetary, bestFrequency: valFrequency, bestRecency: valRecency, segmentCust: resultData });
    };



    calculateDifferenceDays = (date) => {
        const currentDate = new Date(); // Tanggal referensi (biasanya hari ini)
        // console.log("cek hari ini bang", currentDate)
        // Menghitung perbedaan waktu dalam milidetik antara dua tanggal
        const milidetikPerbedaan = Math.abs(currentDate - this.strToDate(date));
        // console.log("milidetik", milidetikPerbedaan)

        // Menghitung perbedaan hari dengan membagi perbedaan waktu dalam milidetik
        // dengan jumlah milidetik dalam satu hari (1000 milidetik * 60 detik * 60 menit * 24 jam)
        const perbedaanHari = Math.floor(milidetikPerbedaan / (1000 * 60 * 60 * 24));

        return perbedaanHari;
    }


    strToDate = (dateString) => {

        // Pisahkan string menjadi komponen tanggal, bulan, dan tahun
        const dateParts = dateString.split("/");
        const day = parseInt(dateParts[0], 10); // Konversi ke integer
        const month = parseInt(dateParts[1], 10) - 31; // Konversi ke integer dan kurangi 1 karena indeks bulan dimulai dari 0
        const year = parseInt(dateParts[2], 10);

        // Buat objek Date
        const dateObject = new Date(year, day, month);
        return dateObject
    }
    render() {

        const { championsCount, loyalCostumersCount, atRiskCustomersCount } = this.state;

        const data = {
            labels: ['Champion', 'Loyal Customer', 'At Risk Customer'],
            datasets: [
                {
                    label: 'Jumlah Pelanggan',
                    backgroundColor: ['green', 'blue', 'red'],
                    borderColor: 'rgba(0,0,0,1)',
                    data: [championsCount, loyalCostumersCount, atRiskCustomersCount],
                }
            ]
        }
        console.log('cekData', data)

        const options = {
            sales: {
                beginAtZero: true,
            }
        }
        return (
            <div className='w-full flex flex-col max-h-screen '>
                <div className='flex w-full justify-center items-center py-10'>
                    <p className='text-2xl font-bold'>System RFM Analysis</p>
                </div>
                <div className='w-full flex '>
                    <div className='w-full mx-auto flex flex-col items-center max-h-[75vh] overflow-y-auto'>
                        <div className="w-full max-w-screen-lg mx-auto shadow-xl rounded-sm border border-gray-200 bg-white">
                            <header className="px-5 py-4 border-b border-gray-100 flex w-full space-x-6">
                                <h2 className="font-semibold text-gray-800">Upload Your Data</h2>
                                <input type="file" accept=".csv" className='border border-gray-950' onChange={this.handleFileChange} />
                            </header>
                            <div className="p-3">
                                <div className="overflow-x-auto">
                                    <table className="table-auto w-full">
                                        <thead className="text-lg font-semibold uppercase text-gray-400 bg-gray-50">
                                            <tr>
                                                <th className="p-2 whitespace-nowrap">
                                                    <div className="font-semibold text-left">Customer ID</div>
                                                </th>
                                                <th className="p-2 whitespace-nowrap">
                                                    <div className="font-semibold text-left">Name</div>
                                                </th>
                                                <th className="p-2 whitespace-nowrap">
                                                    <div className="font-semibold text-left">Recency</div>
                                                </th>
                                                <th className="p-2 whitespace-nowrap">
                                                    <div className="font-semibold text-left">Frequency</div>
                                                </th>
                                                <th className="p-2 whitespace-nowrap">
                                                    <div className="font-semibold text-left">Monetary</div>
                                                </th>
                                                <th className="p-2 whitespace-nowrap">
                                                    <div className="font-semibold text-left">Tertinggi</div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-xl divide-y divide-gray-100">
                                            {this.state.data.length ? this.state.data.map((customer, index) => (
                                                <tr key={customer.CustomerID}>
                                                    <td className="p-2 whitespace-nowrap">
                                                        <div className="text-left">{customer.CustomerID}</div>
                                                    </td>
                                                    <td className="p-2 whitespace-nowrap">
                                                        <div className="text-left">{customer.Name}</div>
                                                    </td>
                                                    <td className="p-2 whitespace-nowrap">
                                                        <div className="text-left">{customer.Recency}</div>
                                                    </td>
                                                    <td className="p-2 whitespace-nowrap">
                                                        <div className="text-left">{customer.Frequency}</div>
                                                    </td>
                                                    <td className="p-2 whitespace-nowrap">
                                                        <div className="text-left">{customer.Monetary}</div>
                                                    </td>
                                                    <td className="p-2 whitespace-nowrap">
                                                        <div className="text-left">{customer.Tertinggi}</div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={3} className='flex text-center text-lg w-full justify-center items-center'>Tidak Ada Data zis</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </div>

                    </div>
                    <div className='w-80 h-80 text-center font-semibold p-5 grid gap-2 px-2'>
                        <p>
                            Segmentasi Pelanggan
                        </p>
                        <Pie data={data}
                            options={{
                                title: {
                                    display: true,
                                    text: 'Class Strength',
                                    fonstSize: 20,
                                },
                                legend: {
                                    display: true,
                                    position: 'right',
                                },
                            }}
                        />
                    </div>
                    <div className='max-w-xs w-full grid gap-2 px-12 overflow-y-auto'>
                        <div className='w-48 h-48 bg-white border border-neutral-200 shadow-2xl text-center rounded-xl p-5 text-gray-400 flex flex-col items-center justify-center'>
                            <p>
                                Pelanggan Royal
                            </p>
                            {
                                this.state.bestMonetary && (<>
                                    <div className='text-lg font-bold text-black'>{this.state.bestMonetary.Name}</div>
                                    <div className='text-lg font-bold text-black'>Rp. {this.state.bestMonetary.Monetary}</div>
                                </>
                                )
                            }
                        </div>
                        <div className='w-48 h-48 bg-white border border-neutral-200 shadow-2xl text-center rounded-xl p-5 text-gray-400 flex flex-col items-center justify-center'>
                            <p>
                                Pelanggan Loyal
                            </p>
                            {
                                this.state.bestFrequency && (<>
                                    <div className='text-lg font-bold text-black'>{this.state.bestFrequency.Name}</div>
                                    <div className='text-lg font-bold text-black'>Total Datang {this.state.bestFrequency.Frequency}</div>
                                </>
                                )
                            }
                        </div>
                        <div className='w-48 h-48 bg-white border border-neutral-200 shadow-2xl text-center rounded-xl p-5 text-gray-400 flex flex-col items-center justify-center'>
                            <p>
                                Top Recency
                            </p>
                            {
                                this.state.bestRecency && (<>
                                    <div className='text-lg font-bold text-black'>{this.state.bestRecency.Name}</div>
                                    <div className='text-lg font-bold text-black'>{this.state.bestRecency.Recency} Hari Yang lalu</div>
                                </>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default FormUpload;