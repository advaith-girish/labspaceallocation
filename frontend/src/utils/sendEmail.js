import emailjs from "@emailjs/browser";

export const sendEmail = async (toEmail) => {
  try {
    const templateParams = {
      to_email: toEmail, // Student's email
    };

    await emailjs.send(
      "service_n4dr5h7",   // Replace with your EmailJS Service ID
      "template_2snv53a",  // Replace with your EmailJS Template ID
      templateParams,
      "soB41rn2cNpMBwvf4"    // Replace with your EmailJS Public Key
    );

    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
