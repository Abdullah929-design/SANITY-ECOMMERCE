import React, { useRef } from 'react';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineShopping } from 'react-icons/ai';
import {HiOutlineTrash} from 'react-icons/hi'
import toast from 'react-hot-toast';
import { useStateContext } from '../context/StateContext';
import { urlFor } from '../lib/client';
import getStripe from '../lib/getStripe';

const Cart = () => {
  const cartRef = useRef();
  const {cartItems, totalPrice, totalQty, onRemove, toggleCartItemQuantity, setCartItems, setTotalPrice, setTotalQty} = useStateContext();

  const handleCheckout = async () => {
    // Demo checkout without Stripe
    toast.loading('Processing checkout...');
    
    // Simulate processing delay
    setTimeout(() => {
      toast.dismiss();
      toast.success('Order placed successfully! (Demo Mode)');
      
      // Clear cart after successful checkout
      setCartItems([]);
      setTotalPrice(0);
      setTotalQty(0);
      
      // Redirect to success page after delay
      setTimeout(() => {
        window.location.href = '/successPay';
      }, 1500);
    }, 2000);
  }

  return (
    <div className='cart-wrapper' ref={cartRef}>
      <h2>Shopping Cart</h2>
      <div className='cart-container'>
        <div className='cart-items'>
          {cartItems.length < 1 && (
            <div className='empty-cart'>
              <AiOutlineShopping size={150} />
              <h1>Your shopping bag is empty</h1>
            </div>
          )}

          {cartItems.length >= 1 && cartItems.map((item) => {
            let imageUrl = '/placeholder.jpg';
            if (item?.image && item.image[0]) {
              try {
                // Skip images that are still uploading
                if (item.image[0]._upload && item.image[0]._upload.progress !== 100) {
                  console.log('Image still uploading, using placeholder');
                }
                // Check if image has the expected structure for urlFor
                else if (item.image[0].asset) {
                  imageUrl = urlFor(item.image[0]);
                } else {
                  console.log('Image has unexpected structure, using placeholder');
                }
              } catch (error) {
                console.error('Error generating image URL:', error);
              }
            }
            return (
            <div key={item._id} className='item-card'>
              <div className='item-image'>
                <img src={imageUrl} alt='img' />
              </div>
              <div className='item-details'>
                <div className='name-and-remove'>
                  <h3>{item.name}</h3>  
                  <button type='buttin' onClick={() => onRemove(item)} className='remove-item'>
                  <HiOutlineTrash size={28} />  
                  </button>
                </div>
                <p className='item-tag'>Dress</p>
                <p className='delivery-est'>Delivery Estimation</p>
                <p className='delivery-days'>5 Working Days</p>
                <div className='price-and-qty'>
                  <span className='price'>${item.price * item.quantity}</span>  
                  <div>
                    <span className='minus' onClick={() => toggleCartItemQuantity(item._id, 'dec')}><AiOutlineMinus /></span>
                    <span className='num' onClick=''>{item.quantity}</span>
                    <span className='plus' onClick={() => toggleCartItemQuantity(item._id, 'inc')}><AiOutlinePlus /></span>
                  </div>   
                </div>
              </div>
            </div>
            );
            })}    
        </div>

        {cartItems.length >= 1 && (
        <div className='order-summary'>
          <h3>Order Summary</h3>
          <div className='qty'>
            <p>Quantity</p>
            <span>{totalQty} Product</span>
          </div>
          <div className='subtotal'>
            <p>Sub Total</p>
            <span>${totalPrice}</span>
          </div>
          {/* <div className='total'>
            <p>Total</p>
            <span>${totalPrice}</span>
          </div>  */}
          <div>
            <button className='btn' type='button' onClick={handleCheckout}>Process to Checkout</button>
          </div>         
        </div>
        )}  

      </div>
    </div>
  )
}

export default Cart