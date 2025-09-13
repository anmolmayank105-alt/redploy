import Navbar from '../components/Navbar';
import Card from '../components/Card';

const Dashboard = () => {
  const stats = [
    { label: 'Total Alumni', value: '1,234', color: 'blue' },
    { label: 'Active Students', value: '856', color: 'green' },
    { label: 'Upcoming Events', value: '12', color: 'purple' },
    { label: 'Total Donations', value: '$45,678', color: 'yellow' }
  ];

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <div className="flex items-center">
                <div className={`p-3 rounded-full bg-${stat.color}-100 mr-4`}>
                  <div className={`w-6 h-6 bg-${stat.color}-600 rounded`}></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Recent Alumni</h2>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="font-medium">Alumni Name {item}</p>
                    <p className="text-sm text-gray-500">Class of 202{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium">Event Title {item}</p>
                  <p className="text-sm text-gray-500">Dec {item + 10}, 2024</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;