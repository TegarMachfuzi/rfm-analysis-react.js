import React, { Component } from 'react'
class Frecuency extends Component {
    constructor(props) {
        super(props);
        this.state = {
            frequencyData: [], // Data CSV yang akan dibaca
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
                this.calculateFrequency(customerData);
            };

            reader.readAsText(file);
        }
    };


    calculateFrequency = (customerData) => {
        const currentDate = new Date(); // Tanggal referensi (biasanya hari ini)
        const frequencyData = customerData.map((customer) => {
            const transactionDate = new Date(customer.Date);
            const timeDifference = currentDate - transactionDate;
            const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            return {
                CustomerID: customer.CustomerID,
                Name: customer.Name,
                Frequency: daysDifference,
            };
        });

        this.setState({ frequencyData });
    };


    render() {
        return (
            <div className='w-full mx-auto flex flex-col items-center h-screen overflow-y-auto py-20'>
                <div className="w-full max-w-screen-2xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
                    <header className="px-5 py-4 border-b border-gray-100 flex w-full space-x-6">
                        <h2 className="font-semibold text-gray-800">Frequency</h2>
                        <input type="file" accept=".csv" className='border border-gray-950' onChange={this.handleFileChange} />
                    </header>
                    <div className="p-3">
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full">
                                <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                                    <tr>
                                        <th className="p-2 whitespace-nowrap">
                                            <div className="font-semibold text-left">Customer ID</div>
                                        </th>
                                        <th className="p-2 whitespace-nowrap">
                                            <div className="font-semibold text-left">Name</div>
                                        </th>
                                        <th className="p-2 whitespace-nowrap">
                                            <div className="font-semibold text-left">Frequency</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-gray-100">
                                    {this.state.frequencyData.length ? this.state.frequencyData.map((customer, index) => (
                                        <tr key={customer.CustomerID}>
                                            <td className="p-2 whitespace-nowrap">
                                                <div className="text-left">{customer.CustomerID}</div>
                                            </td>
                                            <td className="p-2 whitespace-nowrap">
                                                <div className="text-left">{customer.Name}</div>
                                            </td>
                                            <td className="p-2 whitespace-nowrap">
                                                <div className="text-left">{customer.Frecuency}</div>
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

        );
    }
}

export default Frecuency;