import { useState } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import Table from '../components/Table';

const Events = () => {
  const [events] = useState([
    { 
      id: 1, 
      title: 'Annual Alumni Meet', 
      description: 'Yearly gathering of all alumni',
      date: '2024-12-15',
      location: 'Main Auditorium',
      maxAttendees: 200
    },
    { 
      id: 2, 
      title: 'Tech Talk Series', 
      description: 'Monthly technology presentations',
      date: '2024-12-20',
      location: 'Conference Hall',
      maxAttendees: 50
    },
    { 
      id: 3, 
      title: 'Career Fair', 
      description: 'Job opportunities for students and alumni',
      date: '2024-12-25',
      location: 'Sports Complex',
      maxAttendees: 500
    }
  ]);

  const columns = [
    { key: 'title', header: 'Title' },
    { key: 'date', header: 'Date' },
    { key: 'location', header: 'Location' },
    { key: 'maxAttendees', header: 'Max Attendees' }
  ];

  const handleEdit = (event) => {
    console.log('Edit event:', event);
  };

  const handleDelete = (event) => {
    console.log('Delete event:', event);
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <Button>Create New Event</Button>
        </div>
        
        <Card>
          <Table
            columns={columns}
            data={events}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Card>
      </div>
    </div>
  );
};

export default Events;