import React, { Component } from 'react'
class FormUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recencyData: [], // Data CSV yang akan dibaca
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
                this.calculateRecency(customerData);
            };

            reader.readAsText(file);
        }
    };


    calculateRecency = (customerData) => {
        const filtered = []
        customerData.forEach(item => {
            const exist = filtered.find(f => f.CustomerID === item.CustomerID)
            if (!exist && item.CustomerID) {
                const { CustomerID, Name, ..._dump } = item
                filtered.push({ CustomerID, Name })
            }
        })
        // const Recency = customerData.filter(f => f.CustomerID === item.CustomerID).reduce((f, val) => {
        //     const transactionDate = new Date(f.Date);
        //     const timeDifference = currentDate - transactionDate;
        //     const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        //     return daysDifference > val ? daysDifference : val
        // }, 0)
        const recencyData = filtered.map(item => {
            const arrFilter = customerData.filter(f => f.CustomerID === item.CustomerID)
            const largest = arrFilter.reduce((prev, val) => {
                if (!prev) return val
                const prevDiffDays = this.calculateDifferenceDays(prev.Date)
                const currentDiffDays = this.calculateDifferenceDays(val.Date)
                return prevDiffDays < currentDiffDays ? prev : val
            }, undefined)
            console.log("largest", largest)
            const Recency = this.calculateDifferenceDays(largest.Date)
            return {
                ...item,
                Recency
            }
        }
        )
        // const recencyData = customerData.map((customer) => {
        //     const transactionDate = new Date(customer.Date);
        //     const timeDifference = currentDate - transactionDate;
        //     const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        //     return {
        //         CustomerID: customer.CustomerID,
        //         Name: customer.Name,
        //         Recency: daysDifference,
        //     };
        // });
        console.log("Recency Data", recencyData)

        this.setState({ recencyData });
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
        const month = parseInt(dateParts[1], 10) - 1; // Konversi ke integer dan kurangi 1 karena indeks bulan dimulai dari 0
        const year = parseInt(dateParts[2], 10);

        // Buat objek Date
        const dateObject = new Date(year, day, month);
        console.log("cek hari", dateObject)
        return dateObject
    }
    render() {
        return (
            <div className='w-full mx-auto flex flex-col items-center h-screen overflow-y-auto py-20'>
                <div className="w-full max-w-screen-2xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
                    <header className="px-5 py-4 border-b border-gray-100 flex w-full space-x-6">
                        <h2 className="font-semibold text-gray-800">Recency</h2>
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
                                            <div className="font-semibold text-left">Recency</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-gray-100">
                                    {this.state.recencyData.length ? this.state.recencyData.map((customer, index) => (
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

export default FormUpload;