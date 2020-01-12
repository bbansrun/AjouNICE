const mailgun = require("mailgun-js");
const template = require('./emailConfirmTemplate')

const mg = mailgun({ apiKey: require('../config/config.json')['development']['mailapikey'], domain: require('../config/config.json')['development']['maildomain'] });


const sendConfirmMail = (user_nm, email, authToken) => {
  const data = {
    from: 'Team Bbansrun <kingman330@gmail.com>',
    to: email,
    subject: `${user_nm} 님, AJOUNICE 인증 메일 입니다.`,
    html: template(`http://localhost:8080/auth/authorize?authToken=${authToken}`),
  }
  mg.messages().send(data, (err, body) => {
    console.log(body);
  });
}
// sendConfirmMail('Nailer', 'kingman330@gmail.com', '뀨뀨꺄꺄'); testcode

module.exports = {
  sendConfirmMail,
}