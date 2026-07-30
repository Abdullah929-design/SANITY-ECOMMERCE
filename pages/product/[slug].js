import React, { useState } from 'react'
import { client, urlFor } from '../../lib/client'
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'
import {CgShoppingCart} from 'react-icons/cg'
import { useStateContext } from '../../context/StateContext';

const ProductDetails = ({products, product}) => {
    const { image, name, details, price, tags, care } = product;
    const [index, setIndex] = useState(0);
    const {decQty, incQty, qty, onAdd} = useStateContext();

    const careList = [];

    {for (let i = 0; i < care.length; i++) {
        careList.push(care[i].children[0].text)
    }}

    const getImageUrl = (img) => {
        if (!img) return '/placeholder.jpg';
        try {
            // Skip images that are still uploading
            if (img._upload && img._upload.progress !== 100) {
                console.log('Image still uploading, using placeholder');
                return '/placeholder.jpg';
            }
            // Check if image has the expected structure for urlFor
            else if (img.asset) {
                return urlFor(img);
            } else {
                console.log('Image has unexpected structure, using placeholder');
                return '/placeholder.jpg';
            }
        } catch (error) {
            console.error('Error generating image URL:', error);
            return '/placeholder.jpg';
        }
    };

    return (
        <div className='products'>
            <div className='product-detail-container'>
                <div className='product-images'>
                    <div className='small-images-container'>
                        {image?.map((item, ind) => (
                            <img 
                            key={ind}
                            src={getImageUrl(item)} 
                            className='small-image' 
                            onMouseEnter={() => setIndex(ind)} />
                        ))}
                    </div>
                    <div className='big-image-container'>
                        <img src={getImageUrl(image && image[index])} />
                    </div>
                </div>
                <div className='product-details'>
                    <div className='name-and-category'>
                        <h3>{name}</h3>
                        <span>{tags}</span>   
                    </div>
                    <div className='size'>
                        <p>SELECT SIZE</p>
                        <ul>
                            <li>XS</li>
                            <li>S</li>
                            <li>M</li>
                            <li>L</li>
                            <li>XL</li>
                        </ul>
                    </div>
                    <div className='quantity-desc'>
                        <h4>Quantity: </h4>
                        <div>
                            <span className='minus' onClick={decQty}><AiOutlineMinus /></span>
                            <span className='num' onClick=''>{qty}</span>
                            <span className='plus' onClick={incQty}><AiOutlinePlus /></span>
                        </div>
                    </div>
                    <div className='add-to-cart'>
                        <button className='btn' type='button' onClick={() => onAdd(product, qty)}><CgShoppingCart size={20} />Add to Cart</button>
                        <p className='price'>${price}.00</p>  
                    </div>
                </div>
            </div>

            <div className='product-desc-container'>
                <div className='desc-title'>
                    <div className="desc-background">
                        Overview
                    </div>
                    <h2>Product Information</h2>  
                </div>
                <div className='desc-details'>
                    <h4>PRODUCT DETAILS</h4>
                    <p>{details[0].children[0].text}</p>  
                </div>
                <div className='desc-care'>
                    <h4>PRODUCT CARE</h4>
                    <ul>
                    {careList.map(list => (
                        <li>{list}</li>
                    ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
export default ProductDetails

export const getStaticProps = async ({params: {slug}}) => {
    const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
    const productsQuery = '*[_type == "product"]'
    const product = await client.fetch(query);
    const products = await client.fetch(productsQuery)
  
    return {
      props: { products, product }
    }
}

// Generates `/product/1` and `/product/2`
export const getStaticPaths = async () => {
    const query = `*[_type == "product"] {
        slug {
            current
        }
    }`;

    const products = await client.fetch(query);

    const paths = products.map((product) => ({
        params: {
            slug: product.slug.current
        }
    }));

    return {
      paths,
      fallback: 'blocking'
    }
}
