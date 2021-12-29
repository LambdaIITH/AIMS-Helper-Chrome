str = document.getElementById("appCaptchaLoginImg").src;
captcha = str.slice(str.length-5);
document.getElementById("captcha").value = captcha;