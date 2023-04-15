import React from 'react'
const emailPic = require('../images/mail-in-phone.png');
const marketingPic = require('../images/marketing.png');

const HomePageMiddleSection = () => {
  return (
    <div className='home-middle-section'>
        <h1 className="title">Why you need email marketing for your business?</h1>

        <div className="email-frame">
            <img src={emailPic} alt="" />
            <h1>It is easy and effective way to inform customers about your services and offers in a little time</h1>
        </div>

        <div className="marketing-frame">
            <h1>Based on researches customers who will see information about a product periodically is most likely to become a consumer of it</h1>
            <img src={marketingPic} alt="" />
        </div>
    </div>
  )
}

export default HomePageMiddleSection