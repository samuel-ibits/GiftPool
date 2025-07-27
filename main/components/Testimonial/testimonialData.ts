import image1 from "@/public/images/user/user-01.png";
import image2 from "@/public/images/user/user-02.png";
import { Testimonial } from "@/lib/types/testimonial";

export const testimonialData: Testimonial[] = [
  {
    id: 1,
    name: "Sarah",
    designation: "Influencer",
    image: image1,
    content:
      "GiftPool made my giveaway seamless! My fans loved it, and I saved so much time.",
  },
  {
    id: 2,
    name: "Mike",
    designation: "Small Business Owner",
    image: image2,
    content:
      "We raised $5,000 for our community project in just 2 days. Highly recommend GiftPool!",
  },
  // {
  //   id: 3,
  //   name: "Devid Smith",
  //   designation: "Founter @democompany",
  //   image: image1,
  //   content:
  //     "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris hendrerit, ligula sit amet cursus tincidunt, lorem sem elementum nisi, convallis fringilla ante nibh non urna.",
  // },
  // {
  //   id: 4,
  //   name: "Jhon Abraham",
  //   designation: "Founter @democompany",
  //   image: image2,
  //   content:
  //     "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris hendrerit, ligula sit amet cursus tincidunt, lorem sem elementum nisi, convallis fringilla ante nibh non urna.",
  // },
];
