import { DataGrid } from "./components/DataGrid/DataGrid";
import { generateData } from "./utils/generateData";

function App() {
  const data = generateData(1000);

  const columns = [
    { id: "id", title: "ID", width: 80, render: (r: any) => r.id },
    { id: "name", title: "Name", width: 150, render: (r: any) => r.name },
  ];

  return <DataGrid columns={columns} data={data} />;
}

export default App;
