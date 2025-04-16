import Blog from "../../pages/frontend/home/Blog"; 
import Category from "../../pages/frontend/home/Category"; 
import Product from "../../pages/frontend/home/Product"; 
import Slider from "../../pages/frontend/home/Slider"; 
import Testimonial from "../../pages/frontend/home/Testimonial"; 
import Footer from "./Footer"; 
import Header from "./Header";
import Modal from "./Modal";
 
function Home(props) { 
  return ( 
    <> 
    
      <Slider /> 
      <Category /> 
      <Product />
      <Testimonial /> 
      <Blog /> 
</> 
); 
} 
export default Home;