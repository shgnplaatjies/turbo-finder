import React from "react";
import DropDowns from "../components/NavBar/DropDowns";
import EstimatesTable from "../components/NavBar/EstimatesTable";
import NavBar from "../components/NavBar/NavBar";

const DashboardPage: React.FC = () => {
  return (
    <main className="dashboard-page">
      <NavBar />
      <DropDowns />
      <EstimatesTable />
    </main>
  );
};

export default DashboardPage;
