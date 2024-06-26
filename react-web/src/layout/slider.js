import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import '../App.css';

const Slider = () =>{
    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };
    return(
        <div>
            <Carousel activeIndex={index} onSelect={handleSelect}>
                <Carousel.Item>
                    <img
                    className="d-block w-100 rounded"
                    src="https://i2gether.com/img/bgi2.png"
                    alt="First"
                    height={300}
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                    className="d-block w-100 rounded"
                    src="./sup2.png"
                    alt="First"
                    height={300}
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                    className="d-block w-100 rounded"
                    src="./24_7.png"
                    alt="Second"
                    height={300}
                    />
                </Carousel.Item>
            </Carousel>
        </div>
    )
}

export default Slider