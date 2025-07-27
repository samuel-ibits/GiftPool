// app/(dashboard)/dashboard/page.tsx
import GiftingPage from "./gift/create/page";
import DashboardLayout from "./layout";
import StatsPage from "./stats/page";
// Import your components here
// import StatsComponent from '../../../components/StatsComponent';
// import GiftComponent from '../../../components/GiftComponent';

const Dashboard = () => {
  return (
    <div className="space-y-6 dark:bg-black">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Quick Stats Cards */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
            <div className="text-2xl text-blue-500">👥</div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$12,345</p>
            </div>
            <div className="text-2xl text-green-500">💰</div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Orders</p>
              <p className="text-2xl font-bold text-gray-900">567</p>
            </div>
            <div className="text-2xl text-purple-500">📦</div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Growth</p>
              <p className="text-2xl font-bold text-gray-900">+12%</p>
            </div>
            <div className="text-2xl text-red-500">📈</div>
          </div>
        </div>
      </div>

      {/* Main Content Area - This is where you'll import your components */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Stats Component
          </h3>
          {/* <StatsComponent /> */}
          <div className="py-8 text-center text-gray-500">
            <StatsPage />
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Gift Component
          </h3>
          {/* <GiftComponent /> */}
          <div className="py-8 text-center text-gray-500">
            <GiftingPage />{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
