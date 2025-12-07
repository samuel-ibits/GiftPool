// app/(dashboard)/dashboard/page.tsx
import StatsComponent from "@/components/Stats";
// import DashboardLayout from "./layout";


const Dashboard = () => {
  return (
    <div className="space-y-6 dark:bg-black">
      <StatsComponent />
    </div>
  );
};

export default Dashboard;
