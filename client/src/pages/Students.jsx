import { useState } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import Table from '../components/Table';

const Students = () => {
  const [students] = useState([
    { 
      id: 1, 
      name: 'Alice Johnson', 
      email: 'alice@student.edu', 
      enrollmentYear: 2022, 
      department: 'Computer Science',
      year: 2
    },
    { 
      id: 2, 
      name: 'Bob Wilson', 
      email: 'bob@student.edu', 
      enrollmentYear: 2021, 
      department: 'Business',
      year: 3
    },
    { 
      id: 3, 
      name: 'Carol Brown', 
      email: 'carol@student.edu', 
      enrollmentYear: 2023, 
      department: 'Engineering',
      year: 1
    }
  ]);

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'enrollmentYear', header: 'Enrollment Year' },
    { key: 'department', header: 'Department' },
    { key: 'year', header: 'Current Year' }
  ];

  const handleEdit = (student) => {
    console.log('Edit student:', student);
  };

  const handleDelete = (student) => {
    console.log('Delete student:', student);
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <Button>Add New Student</Button>
        </div>
        
        <Card>
          <Table
            columns={columns}
            data={students}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Card>
      </div>
    </div>
  );
};

export default Students;