import React from 'react'
import Link from 'next/link'
import { urlFor } from '../lib/client'

const Product = ({product}) => {
  const {image, name, slug, price} = product || {};
  let imageUrl = '/placeholder.jpg';
  
  if (image && image[0]) {
    try {
      // Skip images that are still uploading
      if (image[0]._upload && image[0]._upload.progress !== 100) {
        console.log('Image still uploading, using placeholder');
        imageUrl = '/placeholder.jpg';
      }
      // Check if image has the expected structure for urlFor
      else if (image[0].asset) {
        imageUrl = urlFor(image[0]);
      } else {
        console.log('Image has unexpected structure, using placeholder');
        imageUrl = '/placeholder.jpg';
      }
    } catch (error) {
      console.error('Error generating image URL:', error);
      imageUrl = '/placeholder.jpg';
    }
  }
  
  return (
    <div>
      <Link href={slug?.current ? `/product/${slug.current}` : '#'}>
        <div className='product-card'>
          <img src={imageUrl} width={380} height={400} className='product-image' />
          <p className='product-name'>{name}</p>
          <p className='product-price'>${price}</p>
        </div>
      </Link>
    </div>
  )
}

export default Product