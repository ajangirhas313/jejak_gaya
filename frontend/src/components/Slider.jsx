import {} from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function MultipleItems() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: true
  };

  const imageUrls = [
    "https://i3.wp.com/static.nike.com/a/images/f_auto/dpr_1.6,cs_srgb/h_650,c_limit/075f238f-08b6-4002-9c62-ef2ab1f1ed80/nike-just-do-it.jpg",
    "https://static.nike.com/a/images/w_1536,c_limit/38f3acdc-ce00-4854-8ff2-2506cf17dda5/running-shoe-finder-dual-gender.png",
    "https://static.nike.com/a/images/f_auto,cs_srgb/w_1536,c_limit/ef694d9b-8d0b-4d92-9a6c-dbdf5db61071/nike-basketball.jpg",
    "https://mosaic04.ztat.net/prd/media/comet/N1242A2N3-C11/PREVIEW_IMG/0002708AV63_image_1697590159.jpg",
  ];

  return (
    <div className="slider-container max-w-4xl mx-auto p-4">
      <Slider {...settings}>
        {imageUrls.map((url, index) => (
          <div key={index} className="p-2">
            <img
              src={url}
              alt={`Product ${index + 1}`}
              className="w-full h-96 object-cover rounded-lg shadow-lg transition-transform transform hover:scale-105"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default MultipleItems;
