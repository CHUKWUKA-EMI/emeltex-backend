const fs = require("fs");
const faker = require("faker");

const categories = [];
faker.locale = "en";

const create = () => {
  for (let i = 0; i < 10; i++) {
    const category = {
      name: faker.commerce.department(),
      description: faker.commerce.productDescription(),
    };
    categories.push(category);
  }
};

create();

fs.writeFile("./categories.json", JSON.stringify(categories), (err) => {
  if (err) {
    console.log("error", err);
  }
  console.log("Categories created.");
});
