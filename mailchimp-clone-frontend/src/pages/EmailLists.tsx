import React from 'react'
import SideMenu from '../components/SideMenu'
import EmailListComponent from '../components/EmailListComponent'

const EmailLists = () => {
  return (
    <div className='email-list'>
        <SideMenu page={"email-lists"}/>
        
        
        <div className="content">

          <div className="header">
            <h1 className="title">Email Lists</h1>
          </div>

          <div className="email-components-list">
            <EmailListComponent listName={"something"}/>
            <EmailListComponent />
            <EmailListComponent />
            <EmailListComponent />
          </div>
        </div>
    </div>
  )
}

export default EmailLists