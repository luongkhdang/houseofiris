import emailjs from "@emailjs/browser";

const emailjsPublicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "default_template";

if (emailjsPublicKey) {
  emailjs.init(emailjsPublicKey);
}

export const emailService = {
  sendFeedback: async (message: string) => {
    if (!serviceId || !emailjsPublicKey) {
      throw new Error("EmailJS configuration is missing");
    }

    const templateParams = {
      message,
      to_email: "Luongdang0701@gmail.com",
    };

    return emailjs.send(
      serviceId,
      templateId,
      templateParams,
      emailjsPublicKey
    );
  }
};