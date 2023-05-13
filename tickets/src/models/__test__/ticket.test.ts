import { Ticket } from "../ticket";

it("implement optimistic concurreny control", async () => {
    // create an instance of a ticket
    const ticket = Ticket.build({
        title: "OKOK",
        price: 5,
        userId: "123",
    });

    //save the ticket in the database
    await ticket.save();

    // fetched the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    //make two seperate changes to the tickets we fetched
    firstInstance?.set({
        price: 10,
    });

    secondInstance?.set({
        price: 15,
    });

    //save the first fetched ticket
    await firstInstance?.save();

    //save the second fetched ticket and expect an error
    try {
        await secondInstance?.save();
    } catch (error) {
        return;
    }

    throw new Error("should not reach this point");
});
