interface Customer {
  id: number;
  name: string;
  email?: string;
}

function processCustomer(customer: any, discount: any) {
  var finalAmount = 1000;

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