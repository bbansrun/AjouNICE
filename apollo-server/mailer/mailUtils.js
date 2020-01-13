const template = require('./emailConfirmTemplate')
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(require('../config/config.json')['development']['mailapikey'])

const sendConfirmMail = async (user_nm, email, authToken) => {
  const msg = {
    to: email,
    from: 'kingman330@gmail.com',
    subject: `[AjouNICE!] ${user_nm}님, 서비스 인증 메일입니다.`,
    html: template(`http://localhost:8080/auth/authorize?authToken=${authToken}`),
  }

  sgMail.send(msg).then(() => {
    console.log('Sended Email')
  }).catch(error => {
    console.error(error)
  })
}

module.exports = {
  sendConfirmMail,
}