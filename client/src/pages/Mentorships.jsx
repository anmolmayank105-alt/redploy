import { useState } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import Table from '../components/Table';

const Mentorships = () => {
  const [mentorships] = useState([
    { 
      id: 1, 
      mentor: 'John Doe', 
      mentee: 'Alice Johnson',
      field: 'Software Development',
      status: 'active'
    },
    { 
      id: 2, 
      mentor: 'Jane Smith', 
      mentee: 'Bob Wilson',
      field: 'Business Strategy',
      status: 'pending'
    },
    { 
      id: 3, 
      mentor: 'Mike Johnson', 
      mentee: 'Carol Brown',
      field: 'Engineering',
      status: 'completed'
    }
  ]);

  const columns = [
    { key: 'mentor', header: 'Mentor' },
    { key: 'mentee', header: 'Mentee' },
    { key: 'field', header: 'Field' },
    { key: 'status', header: 'Status' }
  ];

  const handleEdit = (mentorship) => {
    console.log('Edit mentorship:', mentorship);
  };

  const handleDelete = (mentorship) => {
    console.log('Delete mentorship:', mentorship);
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Mentorships</h1>
          <Button>Create New Mentorship</Button>
        </div>
        
        <Card>
          <Table
            columns={columns}
            data={mentorships}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Card>
      </div>
    </div>
  );
};

export default Mentorships;