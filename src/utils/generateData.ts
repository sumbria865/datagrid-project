export function generateData(count: number) {

  const data = [];

  for (let i = 0; i < count; i++) {
    data.push({
      id: i,
      name: "User " + i,
      age: 20 + (i % 50)
    });
  }

  return data;
}
