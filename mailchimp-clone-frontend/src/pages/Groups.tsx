import React from 'react'
import SideMenu from '../components/SideMenu'
import GroupsComponent from '../components/GroupsComponent'

const Groups = () => {
  return (
    <div className='groups'>
        <SideMenu page={"groups"}/>
        <div className="content">
          <div className="header">
              <h1 className="title">Groups For Bulk Email Sending</h1>
          </div>


        <div className="groups-list">
          <GroupsComponent groupName1={"name"}/>
          <GroupsComponent />
          <GroupsComponent />
          <GroupsComponent />
          <GroupsComponent />
        </div>

        </div>

    </div>
  )
}

export default Groups