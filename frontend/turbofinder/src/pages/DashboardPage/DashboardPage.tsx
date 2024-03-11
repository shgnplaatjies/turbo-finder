import React from "react";
import DropDowns from "../../components/DropDowns/DropDowns";
import EstimatesTable from "../../components/EstimatesTable/EstimatesTable";

import "./DashboardPage.scss";

const DashboardPage: React.FC = () => {
  return (
    <main className="dashboard-page">
      <DropDowns />
      <EstimatesTable />
    </main>
  );
};

export default DashboardPage;
