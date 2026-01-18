import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DataGrid } from "../components/DataGrid/DataGrid";
import type { Column } from "../components/DataGrid/types";
import { generateData } from "../utils/generateData";

interface Row {
  id: number;
  name: string;
  age: number;
}

const columns: Column<Row>[] = [
  {
    id: "id",
    title: "ID",
    width: 80,
    pinned: "left",
    sortable: true,
    render: r => r.id,
  },
  {
    id: "name",
    title: "Name",
    width: 200,
    sortable: true,
    render: r => r.name,
    editor: value => (
      <input
        className="w-full h-full px-1 outline-none"
        defaultValue={value}
        autoFocus
      />
    ),
    validate: async value => value.length > 2,
  },
  {
    id: "age",
    title: "Age",
    width: 100,
    sortable: true,
    render: r => r.age,
  },
];

const meta: Meta<typeof DataGrid<Row>> = {
  title: "Components/DataGrid",
  component: DataGrid<Row>,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LargeDataset: Story = {
  args: {
    columns,
    data: generateData<Row>(50_000, i => ({
      id: i,
      name: `User ${i}`,
      age: 18 + (i % 40),
    })),
  },
};
