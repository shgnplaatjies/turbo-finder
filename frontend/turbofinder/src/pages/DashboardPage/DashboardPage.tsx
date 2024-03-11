import React from "react";
import DropDowns from "../../components/DropDowns/DropDowns";
import EstimatesTable from "../../components/EstimatesTable/EstimatesTable";
import NavBar from "../../components/NavBar/NavBar";

import "./DashboardPage.scss";

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
