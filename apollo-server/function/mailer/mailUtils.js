const confirmTemplate = require('./emailConfirmTemplate');
const contactTemplate = require('./emailContactTemplate');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(require('../../config/config.json').development.mailapikey);

const sendConfirmMail = async (user_nm, email, authToken, isResetEmail = false) => {
  let url;
  let subject;
  if (isResetEmail) {
    subject = '[AjouNICE!] 패스워드 재설정 링크를 보내드립니다.';
    url = `http://${require('ip').address()}:8080/#/auth/authorize/reset?authToken=${authToken}`;
  } else {
    subject = `[AjouNICE!] ${user_nm}님, 서비스 인증 메일입니다.`;
    url = `http://${require('ip').address()}:8080/#/auth/authorize?authToken=${authToken}`;
  }
  const msg = {
    to: email,
    from: 'team.ajounice@gmail.com',
    subject: subject,
    html: confirmTemplate(url),
  };

  sgMail.send(msg).then(() => {
    console.log('Sended Email');
  }).catch(error => {
    console.error(error);
  });
};

const sendContactMail = async (name, email, content) => {
  const mailContent = {
    to: 'team.ajounice@gmail.com',
    from: email,
    subject: `[Contact] ${name}님이 보내신 문의 이메일입니다.`,
    html: contactTemplate(name, content),
  };

  sgMail.send(mailContent).then(() => {
    console.log('Sended Email');
  }).catch(error => {
    console.error(error);
  });
};

module.exports = {
  sendConfirmMail,
  sendContactMail,
};
