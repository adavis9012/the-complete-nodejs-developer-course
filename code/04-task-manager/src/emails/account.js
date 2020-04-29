const sgMail = require('@sendgrid/mail'); 
const sendgridAPIKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendgridAPIKey);

const sendWillkommenEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'andres.velandia9012@gmail.com',
        subject: 'Danke, für mitmachen Sie!',
        text: `Willkomen in der App, ${name}. Lassen Sie mich wissen, wie Sie mit der App asukommen.`
    });
};

const sendAbsagenEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'andres.velandia9012@gmail.com',
        subject: 'Es tut mir leid, dass rausgehen Sie',
        text: `Auf Wiedersehen, ${name}. wir hoffen, sehen Sie wieder zu bald.`
    });
};

module.exports = {
    sendWillkommenEmail,
    sendAbsagenEmail
};


