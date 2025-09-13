import { useState } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import Table from '../components/Table';

const Alumni = () => {
  const [alumni] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      graduationYear: 2020, 
      department: 'Computer Science',
      company: 'Tech Corp'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      graduationYear: 2019, 
      department: 'Business',
      company: 'StartupXYZ'
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      email: 'mike@example.com', 
      graduationYear: 2021, 
      department: 'Engineering',
      company: 'Engineering Solutions'
    }
  ]);

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'graduationYear', header: 'Graduation Year' },
    { key: 'department', header: 'Department' },
    { key: 'company', header: 'Company' }
  ];

  const handleEdit = (alumnus) => {
    console.log('Edit alumnus:', alumnus);
  };

  const handleDelete = (alumnus) => {
    console.log('Delete alumnus:', alumnus);
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Alumni</h1>
          <Button>Add New Alumni</Button>
        </div>
        
        <Card>
          <Table
            columns={columns}
            data={alumni}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Card>
      </div>
    </div>
  );
};

export default Alumni;