const template = require('./emailConfirmTemplate')
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(require('../config/config.json')['development']['mailapikey']);

const sendConfirmMail = async (user_nm, email, authToken) => {
  const msg = {
    to: email,
    from: 'kingman330@gmail.com',
    subject: `${user_nm} 님, AJOUNICE 인증 메일 입니다.`,
    html: template(`http://localhost:8080/auth/authorize?authToken=${authToken}`),
  };

  try {
    await sgMail.send(msg);
  } catch (err) {
    console.log(err)
  }
  return;
}
// test sendConfirmMail
// sendConfirmMail('nailer', 'kingman330@gmail.com', '뀨꺆꺄뀨ㅑ뀪꺄ㅠ꺄');

module.exports = {
  sendConfirmMail,
}