//校验邮箱格式
function checkEmail(email) {
  return RegExp(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/).test(
    email);
}
//校验手机格式
function checkMobile(mobile) {
  return RegExp(/^1[34578]\d{9}$/).test(mobile);
}

module.exports = {
  checkEmail: checkEmail,
  checkMobile: checkMobile
}
