import nodemailer from "nodemailer";
const mailer = function (email, callback) {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "<email_id",
      pass: "<password>",
    },
  });
  const mailOptions = {
    from: "<email_id>",
    to: email,
    subject: "Registration Link for teacher",
    html: `Hello ${email}, this mail is regarding registration link which is given below. You must click on the below link to register yourself.<br><br>
      <form action="http://localhost:3000/teacher/teacherRegistration" method="post">
        <input type="hidden" name="email" id="email" value="${email}">
        <button>Click to Register</button>
      </form>`,
  };
  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error whlie sending mail from mailer : ", error);
      callback(false);
    } else {
      console.log("Mail sent from mailer: ");
      callback(info);
    }
  });
};

export default { mailer: mailer };
