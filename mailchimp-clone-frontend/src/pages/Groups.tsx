import React, { useEffect, useState } from 'react'
import SideMenu from '../components/SideMenu'
import GroupsComponent from '../components/GroupsComponent'
import { API } from '../utils/API'
import LoadingCube from '../loading-animation/LoadingCube'

interface Group {
  id: number,
  groupName: string,
  bulkMailLists: []
}

const Groups = () => {

    const [groupList, setGroupList] = useState<Group[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(true);


    const getGroups = async () => {
      const jwt = localStorage.getItem("jwtToken");
      const tok = JSON.parse(jwt || "");
      try {
        const response = await API.get(
          `/groups/groups-list`,
          {
            headers: {
              Authorization: `Bearer ${tok?.token}`
            }
          }
        );
        setGroupList(response.data);
        setIsLoading(false);
    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getGroups();
  }, [])
  return (
    <div className='groups'>
        <SideMenu page={"groups"}/>
        <div className="content">
          <div className="header">
              <h1 className="title">Groups For Bulk Email Sending</h1>
          </div>


        <div className="groups-list">
          {groupList.map(group => {
            console.log(group?.bulkMailLists)
            return (
              <GroupsComponent groupName={group?.groupName} emailNumber={group?.bulkMailLists.length} id={group?.id}/>
            )
          })}
        </div>

        </div>

        {isLoading && 
            <div className='loading-info'><LoadingCube /> <h1>Loading ...</h1></div>}

    </div>
  )
}

export default Groups