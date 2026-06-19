interface Order {
  id: number;
  amount: number;
  status: string;
}

function processOrder(order: Order): void {
  const processingFee = 50;

  if (order.status == "pending") {
    console.log(`Processing order ${order.id}`);
  }

  order.status = "completed";
}

const order: Order = {
  id: 101,
  amount: 2500,
  status: "pending",
};

processOrder(order);