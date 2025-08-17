export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pizzaSize, pizzaCost, crustSize } = body;

    if (!pizzaSize || !pizzaCost) {
      return Response.json(
        { error: "Pizza size and cost are required" },
        { status: 400 },
      );
    }

    const radius = pizzaSize / 2;
    const area = Math.PI * radius * radius;
    const pricePerSquareInch = pizzaCost / area;

    let pricePerSquareInchWithoutCrust; // maths
    let percentOfPizzaIsCrust;
    let payForCrust;
    if (crustSize) {
      const radiusWithoutCrust = (pizzaSize - crustSize) / 2;
      const areaWithoutCrust =
        Math.PI * radiusWithoutCrust * radiusWithoutCrust;
      pricePerSquareInchWithoutCrust = pizzaCost / areaWithoutCrust;
      percentOfPizzaIsCrust = 1 - areaWithoutCrust / area;
      payForCrust = pizzaCost * percentOfPizzaIsCrust;
    }

    return Response.json({
      message: "success!",
      data: {
        pricePerSquareInch,
        pricePerSquareInchWithoutCrust,
        percentOfPizzaIsCrust,
        payForCrust,
      },
    });
  } catch {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
