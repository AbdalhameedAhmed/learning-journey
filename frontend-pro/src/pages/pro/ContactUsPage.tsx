import contactUsImage from "@/assets/contact-us.jpg";

const ContactUsPage = () => {
  return (
    <div className="h-[calc(100vh-4rem)] w-screen overflow-hidden bg-white p-2">
      <img
        src={contactUsImage}
        alt="تواصل معنا"
        className="h-full w-full object-contain"
      />
    </div>
  );
};

export default ContactUsPage;
