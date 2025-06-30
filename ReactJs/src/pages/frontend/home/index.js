import Blog from "./Blog";
import Category from "./Category";
import Notification from "./Notification";
import Product from "./Product";
import Slider from "./Slider";
import Testimonial from "./Testimonial";
import Modal from "./Modal";
import Chat from "./Chat"
import Chatbot from "./chatbot"

const index = () => {
  return (
    <>
      <Slider />
      <Category />
      <Product />
      <Testimonial />
      <Blog />
      {/* <Chat /> */}
      <Chatbot />
      <Modal />
      <Notification />
    </>
  );
}
export default index;
