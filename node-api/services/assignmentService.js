const Ticket = require("../models/Ticket");
const User = require("../models/User");
const { sendEmailWithTemplate } = require("./emailService");

const processAssignments = ()=>{
    console.log("Assignment Process started");
    assignNewTickets();


    console.log("Assignment Process completed")
};

const assignNewTickets = async () => {
    let tickets = await Ticket.findAll({where:{status:'Created'}});
    const user = await User.findByPk(1); 
    tickets.forEach(async (ticket) => {
        console.log("Assigning ticket "+ticket.code);
        ticket.assignmentStatus = 'Assigned (L1)';
        
        await ticket.update({ assignedTo: 1, assignmentStatus: 'Assigned (L1)', status:  'Assigned'});
        const placeholders = { code: ticket.code, email:user.email, name: user.name, title: ticket.title };
        const templateId = 6;
        await sendEmailWithTemplate(templateId, user.email , placeholders);

    });
};

module.exports = { processAssignments}; 