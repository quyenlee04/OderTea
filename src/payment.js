const express = require('express');
const PayOs = require('@payos/node');
const nodemailer = require('nodemailer');

const payOs = new PayOs('client_id', 'api-key', 'checksum-key');
const app = express();

app.use(express.static('public'));
app.use(express.json());

const YOUR_DOMAIN = 'localhost/3000';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'quyenle5184@gmail.com',
    pass: 'quyen2k4'
  }
});

app.post('/create-payment-link', async (req, res) => {
    const order = {
        amount: 10000,
        description: 'thanh toan tien com',
        orderCode: 10,
        returnUrl: `${YOUR_DOMAIN}/success.html`,
        cancelUrl: `${YOUR_DOMAIN}/cancel.html`
    };

    const paymentLink = await payOs.createPaymentLink(order);
    
    // Send email with invoice
    const mailOptions = {
        from: 'quyenle5184@gmail.com',
        to: req.body.userEmail,
        subject: 'Your Invoice',
        html: `
            <h2>Invoice Details</h2>
            <p>Order Code: ${order.orderCode}</p>
            <p>Amount: ${order.amount}</p>
            <p>Description: ${order.description}</p>
            <p>Payment Link: ${paymentLink}</p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.json({ paymentLink, emailSent: true });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
