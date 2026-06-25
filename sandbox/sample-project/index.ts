interface Customer {
  id: number;
  name: string;
  email?: string;
}

function processCustomer(customer: Customer, discount: number) {
  let finalAmount = 1000;

  if (customer.id == null) {
    return;
  }

  finalAmount = finalAmount - discount;

  return finalAmount;
}

const customer: Customer = {
  id: 1,
  name: "John Doe",
};

processCustomer(customer, 100);