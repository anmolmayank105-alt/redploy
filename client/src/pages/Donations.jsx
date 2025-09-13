import { useState } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import Table from '../components/Table';

const Donations = () => {
  const [donations] = useState([
    { 
      id: 1, 
      donor: 'John Doe', 
      amount: 5000,
      purpose: 'Scholarship Fund',
      date: '2024-11-15',
      status: 'completed'
    },
    { 
      id: 2, 
      donor: 'Jane Smith', 
      amount: 2500,
      purpose: 'Library Renovation',
      date: '2024-11-20',
      status: 'pending'
    },
    { 
      id: 3, 
      donor: 'Mike Johnson', 
      amount: 10000,
      purpose: 'Research Grant',
      date: '2024-11-25',
      status: 'completed'
    }
  ]);

  const columns = [
    { key: 'donor', header: 'Donor' },
    { key: 'amount', header: 'Amount ($)' },
    { key: 'purpose', header: 'Purpose' },
    { key: 'date', header: 'Date' },
    { key: 'status', header: 'Status' }
  ];

  const handleEdit = (donation) => {
    console.log('Edit donation:', donation);
  };

  const handleDelete = (donation) => {
    console.log('Delete donation:', donation);
  };

  const totalDonations = donations
    .filter(d => d.status === 'completed')
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Donations</h1>
            <p className="text-lg text-gray-600 mt-2">
              Total Received: ${totalDonations.toLocaleString()}
            </p>
          </div>
          <Button>Record New Donation</Button>
        </div>
        
        <Card>
          <Table
            columns={columns}
            data={donations}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Card>
      </div>
    </div>
  );
};

export default Donations;